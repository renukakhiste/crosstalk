/**
 * P0 — New Tab Main Logic
 *
 * Orchestrates the entire new tab experience:
 *   1. Daily reset check
 *   2. Input → display transition
 *   3. Shuffle (background + typography rotation)
 *   4. Lock in (pure, distraction-free view)
 *   5. Unsplash API integration (optional)
 */

// ============================================================================
// Configuration
// ============================================================================

// Replace with your own Unsplash API access key, or leave empty to use
// only the bundled CSS gradient backgrounds (works great without it!)
const UNSPLASH_ACCESS_KEY = '';

// Total number of typography treatments available (matches typo-0 through typo-9)
const TYPOGRAPHY_COUNT = 10;

// How many Unsplash images to pre-fetch at once
const UNSPLASH_BATCH_SIZE = 5;

// ============================================================================
// DOM References
// ============================================================================

const $bgLayer       = document.getElementById('bg-layer');
const $bgLayerNext   = document.getElementById('bg-layer-next');
const $inputScreen   = document.getElementById('input-screen');
const $displayScreen = document.getElementById('display-screen');
const $p0Input       = document.getElementById('p0-input');
const $p0Display     = document.getElementById('p0-display');
const $shuffleCtrl   = document.getElementById('shuffle-controls');
const $btnShuffle    = document.getElementById('btn-shuffle');
const $btnLockIn     = document.getElementById('btn-lockin');
const $photoCredit   = document.getElementById('photo-credit');
const $creditLink    = document.getElementById('credit-link');
const $hoverShuffle  = document.getElementById('hover-shuffle');

// ============================================================================
// State
// ============================================================================

let currentBgIndex   = -1;      // Index into the combined pool
let currentTypoIndex = -1;      // Index into typography treatments
let combinedPool     = [];       // Bundled + any cached Unsplash images
let unsplashCache    = [];       // Pre-fetched Unsplash images
let isShuffleMode    = false;
let isLocked         = false;

// ============================================================================
// Initialization — runs on every new tab open
// ============================================================================

async function init() {
  const data = await chrome.storage.local.get([
    'p0Text', 'lockedBackground', 'lockedTypography', 'lastSetDate', 'unsplashCache'
  ]);

  // Load any cached Unsplash images
  unsplashCache = data.unsplashCache || [];

  // Build the combined background pool
  buildCombinedPool();

  // Check for daily reset
  const today = getTodayString();
  if (data.lastSetDate && data.lastSetDate !== today) {
    // New day — clear everything
    await chrome.storage.local.remove(['p0Text', 'lockedBackground', 'lockedTypography']);
    showInputScreen();
    return;
  }

  // If we have a saved P0, go straight to the display
  if (data.p0Text) {
    showLockedDisplay(data.p0Text, data.lockedBackground, data.lockedTypography);
  } else {
    showInputScreen();
  }
}

// ============================================================================
// Background Pool
// ============================================================================

function buildCombinedPool() {
  // Start with all bundled backgrounds
  combinedPool = [...BUNDLED_BACKGROUNDS];

  // Add any cached Unsplash images
  unsplashCache.forEach(img => {
    combinedPool.push({
      id: `unsplash-${img.id}`,
      css: `url("${img.url}") center/cover no-repeat`,
      isDark: isColorDark(img.color),
      textColor: isColorDark(img.color) ? '#f0ebdc' : '#1a1a1a',
      textColorMuted: isColorDark(img.color) ? '#8a8578' : '#7a7570',
      category: 'unsplash',
      unsplash: img   // Keep the full object for attribution
    });
  });
}

/**
 * Determine if a hex color is dark (for text color decisions).
 * Uses relative luminance formula.
 */
function isColorDark(hex) {
  if (!hex) return false;
  const color = hex.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

// ============================================================================
// Date Utilities
// ============================================================================

function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// ============================================================================
// Screen Transitions
// ============================================================================

function showInputScreen() {
  $inputScreen.classList.remove('hidden');
  $displayScreen.classList.add('hidden');
  $hoverShuffle.classList.add('hidden');
  $photoCredit.classList.add('hidden');
  document.body.classList.remove('locked-state', 'dark-bg');

  // Set a nice light background for the input screen
  $bgLayer.style.background = 'linear-gradient(160deg, #faf3e8, #f0e4d1, #e8d5b8)';

  // Auto-focus the input
  setTimeout(() => $p0Input.focus(), 100);
}

function showDisplayScreen(text) {
  $inputScreen.classList.add('hidden');
  $displayScreen.classList.remove('hidden');

  // Enter shuffle mode so the user can pick their combo
  isShuffleMode = true;
  isLocked = false;
  $shuffleCtrl.classList.remove('hidden');
  $hoverShuffle.classList.add('hidden');

  // Pick a random starting combo
  shuffleCombo(text);
}

function showLockedDisplay(text, bgData, typoIndex) {
  $inputScreen.classList.add('hidden');
  $displayScreen.classList.remove('hidden');
  $shuffleCtrl.classList.add('hidden');
  $hoverShuffle.classList.remove('hidden');

  isShuffleMode = false;
  isLocked = true;
  document.body.classList.add('locked-state');

  // Apply the locked background
  if (bgData) {
    applyBackground(bgData);
  }

  // Apply the locked typography
  if (typoIndex !== undefined && typoIndex !== null) {
    renderTypography(text, typoIndex, bgData);
  } else {
    renderTypography(text, 0, bgData);
  }
}

// ============================================================================
// Background Application (with cross-fade)
// ============================================================================

function applyBackground(bg, animate = false) {
  const cssValue = bg.css || bg;

  if (animate) {
    // Cross-fade: set the next layer, fade it in, then swap
    if (cssValue.startsWith('url(')) {
      $bgLayerNext.style.background = cssValue;
    } else {
      $bgLayerNext.style.background = cssValue;
    }
    $bgLayerNext.style.backgroundSize = 'cover';
    $bgLayerNext.style.backgroundPosition = 'center';
    $bgLayerNext.style.opacity = '1';

    setTimeout(() => {
      $bgLayer.style.background = cssValue;
      $bgLayer.style.backgroundSize = 'cover';
      $bgLayer.style.backgroundPosition = 'center';
      $bgLayerNext.style.opacity = '0';
    }, 500);
  } else {
    $bgLayer.style.background = cssValue;
    $bgLayer.style.backgroundSize = 'cover';
    $bgLayer.style.backgroundPosition = 'center';
  }

  // Update body class for dark/light text
  if (bg.isDark) {
    document.body.classList.add('dark-bg');
  } else {
    document.body.classList.remove('dark-bg');
  }

  // Handle photo credit for Unsplash images
  if (bg.unsplash) {
    $creditLink.textContent = bg.unsplash.photographer;
    $creditLink.href = `${bg.unsplash.profileUrl}?utm_source=p0&utm_medium=referral`;
    $photoCredit.style.color = bg.isDark ? '#f0ebdc' : '#2a2520';
    $photoCredit.classList.remove('hidden');
  } else {
    $photoCredit.classList.add('hidden');
  }
}

// ============================================================================
// Typography Rendering
// ============================================================================

/**
 * Render the P0 text with smart emphasis into the display element.
 * Each typography treatment (typo-0 through typo-9) is applied via CSS class.
 */
function renderTypography(text, typoIndex, bg) {
  // Classify words using the emphasis engine
  const classified = classifyWords(text);
  const groups = groupIntoPhrases(classified);

  // Clear previous typography class
  for (let i = 0; i < TYPOGRAPHY_COUNT; i++) {
    $p0Display.classList.remove(`typo-${i}`);
  }

  // Apply new typography class
  $p0Display.classList.add(`typo-${typoIndex}`);

  // Build the HTML: each phrase group becomes a span with a data-emphasis attribute
  let html = '';
  groups.forEach(group => {
    const text = group.words.join(' ');
    html += `<span data-emphasis="${group.type}">${escapeHtml(text)} </span>`;
  });

  $p0Display.innerHTML = html;

  // Apply color-matched text colors if the background has them
  if (bg && bg.textColor) {
    $p0Display.querySelectorAll('[data-emphasis="power"]').forEach(el => {
      el.style.color = bg.textColor;
    });
    $p0Display.querySelectorAll('[data-emphasis="normal"]').forEach(el => {
      el.style.color = bg.textColor;
    });
    $p0Display.querySelectorAll('[data-emphasis="quiet"]').forEach(el => {
      el.style.color = bg.textColorMuted || bg.textColor;
    });
  } else {
    // Fallback: use CSS-driven colors (via body.dark-bg)
    $p0Display.querySelectorAll('[data-emphasis]').forEach(el => {
      el.style.color = '';
    });
  }
}

/** Prevent XSS from user input */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================================
// Shuffle Logic
// ============================================================================

/**
 * Pick a new random background + typography combo.
 * Avoids repeating the same one twice in a row.
 */
function shuffleCombo(text) {
  // Pick a new background (avoid repeat)
  let newBgIndex;
  do {
    newBgIndex = Math.floor(Math.random() * combinedPool.length);
  } while (newBgIndex === currentBgIndex && combinedPool.length > 1);

  // Pick a new typography treatment (avoid repeat)
  let newTypoIndex;
  do {
    newTypoIndex = Math.floor(Math.random() * TYPOGRAPHY_COUNT);
  } while (newTypoIndex === currentTypoIndex && TYPOGRAPHY_COUNT > 1);

  currentBgIndex = newBgIndex;
  currentTypoIndex = newTypoIndex;

  const bg = combinedPool[currentBgIndex];

  // Fade the text out, swap, fade back in
  $p0Display.style.opacity = '0';
  setTimeout(() => {
    applyBackground(bg, true);
    renderTypography(text, currentTypoIndex, bg);
    $p0Display.style.opacity = '1';
  }, 200);

  // If we're running low on Unsplash cache, fetch more in the background
  if (UNSPLASH_ACCESS_KEY && unsplashCache.length < 3) {
    fetchUnsplashImages();
  }
}

// ============================================================================
// Lock In
// ============================================================================

async function lockIn(text) {
  isShuffleMode = false;
  isLocked = true;

  // Fade out controls
  $shuffleCtrl.classList.add('hidden');

  // Save the current state
  const bg = combinedPool[currentBgIndex];
  await chrome.storage.local.set({
    p0Text: text,
    lockedBackground: bg,
    lockedTypography: currentTypoIndex,
    lastSetDate: getTodayString()
  });

  // Show the hover shuffle button and mark body as locked
  setTimeout(() => {
    $hoverShuffle.classList.remove('hidden');
    document.body.classList.add('locked-state');
  }, 500);
}

// ============================================================================
// Unsplash API Integration
// ============================================================================

async function fetchUnsplashImages() {
  if (!UNSPLASH_ACCESS_KEY) return;

  try {
    const queries = [
      'calm nature minimal',
      'abstract minimal',
      'serene landscape',
      'minimal architecture',
      'soft texture background'
    ];
    const query = queries[Math.floor(Math.random() * queries.length)];

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&count=${UNSPLASH_BATCH_SIZE}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) return;

    const photos = await response.json();

    const newImages = photos.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      color: photo.color,
      photographer: photo.user.name,
      profileUrl: photo.user.links.html
    }));

    // Add to cache and rebuild pool
    unsplashCache = [...unsplashCache, ...newImages];
    await chrome.storage.local.set({ unsplashCache });
    buildCombinedPool();
  } catch (err) {
    // Silently fail — bundled backgrounds are the fallback
    console.warn('P0: Unsplash fetch failed, using bundled backgrounds.', err);
  }
}

// ============================================================================
// Event Listeners
// ============================================================================

// Handle Enter key on the input
$p0Input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const text = $p0Input.value.trim();
    if (text.length === 0) return;

    // Save the date immediately so we know the user set a P0 today
    chrome.storage.local.set({ lastSetDate: getTodayString() });

    // Transition to display
    showDisplayScreen(text);
  }
});

// Shuffle button
$btnShuffle.addEventListener('click', async () => {
  const data = await chrome.storage.local.get('p0Text');
  const text = data.p0Text || $p0Input.value.trim();
  shuffleCombo(text);
});

// Lock In button
$btnLockIn.addEventListener('click', async () => {
  const text = $p0Input.value.trim() || (await chrome.storage.local.get('p0Text')).p0Text;
  if (text) lockIn(text);
});

// Hover shuffle (re-enters shuffle mode from locked state)
$hoverShuffle.addEventListener('click', async () => {
  const data = await chrome.storage.local.get('p0Text');
  if (!data.p0Text) return;

  isShuffleMode = true;
  isLocked = false;
  document.body.classList.remove('locked-state');
  $shuffleCtrl.classList.remove('hidden');
  $hoverShuffle.classList.add('hidden');

  shuffleCombo(data.p0Text);
});

// When transitioning to display, also save the text so shuffle/lock can access it
const originalShowDisplay = showDisplayScreen;
showDisplayScreen = function(text) {
  chrome.storage.local.set({ p0Text: text });
  originalShowDisplay(text);
};

// ============================================================================
// Listen for messages from the popup (changing P0 mid-day)
// ============================================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_P0') {
    const text = message.text;
    if (text && text.trim().length > 0) {
      // Reset to shuffle mode with the new text
      chrome.storage.local.set({
        p0Text: text.trim(),
        lastSetDate: getTodayString()
      }).then(() => {
        // Remove locked state
        chrome.storage.local.remove(['lockedBackground', 'lockedTypography']);
        // Refresh the page to show the new P0
        showDisplayScreen(text.trim());
      });
    }
  }
});

// ============================================================================
// Start
// ============================================================================

init();
