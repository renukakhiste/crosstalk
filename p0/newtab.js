/**
 * P0 — New Tab Main Logic
 *
 * Three states:
 *   1. Input  — "What's your P0 today?"
 *   2. Shuffle — bold editorial typography + rotating backgrounds
 *   3. Locked — just the sentence on the background, nothing else
 */

const TREATMENT_COUNT = 8;

// DOM
const $bg = document.getElementById('bg');
const $overlay = document.getElementById('bg-overlay');
const $stateInput = document.getElementById('state-input');
const $stateShuffle = document.getElementById('state-shuffle');
const $stateLocked = document.getElementById('state-locked');
const $taskForm = document.getElementById('task-form');
const $taskInput = document.getElementById('task-input');
const $shuffleTypo = document.getElementById('shuffle-typo');
const $lockedTypo = document.getElementById('locked-typo');
const $shuffleBtn = document.getElementById('shuffle-btn');
const $lockinBtn = document.getElementById('lockin-btn');
const $hoverBtn = document.getElementById('hover-shuffle-btn');
const $credit = document.getElementById('photo-credit');
const $creditName = document.getElementById('credit-name');

// State
let currentState = 'input';
let task = '';
let currentBg = null;
let currentTreatmentIdx = -1;
let hoverTimer = null;

// =====================================================================
// Date
// =====================================================================

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// =====================================================================
// State Transitions
// =====================================================================

function showState(name) {
  $stateInput.classList.add('hidden');
  $stateShuffle.classList.add('hidden');
  $stateLocked.classList.add('hidden');
  document.getElementById('state-' + name).classList.remove('hidden');
  currentState = name;

  // Hover shuffle only visible in locked state (on mousemove)
  if (name !== 'locked') {
    $hoverBtn.classList.remove('visible');
  }
}

// =====================================================================
// Theme (CSS custom properties)
// =====================================================================

function setTheme(isDark) {
  const s = document.documentElement.style;
  if (isDark) {
    s.setProperty('--text-main', '#f0ebdc');
    s.setProperty('--text-muted', 'rgba(240,235,220,0.45)');
    s.setProperty('--text-inverse', '#1a1a2e');
    s.setProperty('--ui-bg', 'rgba(255,255,255,0.1)');
    s.setProperty('--ui-border', 'rgba(255,255,255,0.15)');
    s.setProperty('--ui-hover', 'rgba(255,255,255,0.18)');
  } else {
    s.setProperty('--text-main', '#1a1a2e');
    s.setProperty('--text-muted', 'rgba(26,26,46,0.45)');
    s.setProperty('--text-inverse', '#f0ebdc');
    s.setProperty('--ui-bg', 'rgba(0,0,0,0.06)');
    s.setProperty('--ui-border', 'rgba(0,0,0,0.1)');
    s.setProperty('--ui-hover', 'rgba(0,0,0,0.1)');
  }
}

// =====================================================================
// Background
// =====================================================================

function applyBg(bg) {
  if (bg.type === 'unsplash') {
    $bg.style.background = '#111 url(' + bg.url + ') center/cover no-repeat';
    $overlay.classList.add('active');
  } else {
    $bg.style.background = bg.css;
    $overlay.classList.remove('active');
  }
  setTheme(bg.isDark);
  currentBg = bg;

  // Photo credit
  if (bg.type === 'unsplash' && bg.photographer) {
    $creditName.textContent = bg.photographer;
    $creditName.href = bg.profileUrl + '?utm_source=p0&utm_medium=referral';
    $credit.classList.remove('hidden');
    // Track download per Unsplash API guidelines
    if (bg.downloadUrl && UNSPLASH_ACCESS_KEY) {
      fetch(bg.downloadUrl, {
        headers: { Authorization: 'Client-ID ' + UNSPLASH_ACCESS_KEY }
      }).catch(function() {});
    }
  } else {
    $credit.classList.add('hidden');
  }
}

// =====================================================================
// Typography Rendering
// =====================================================================

function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function renderTypography(container, treatmentIdx, bg) {
  const parsed = parseEmphasis(task);
  const c = bg.colors || { main: bg.isDark ? '#f0ebdc' : '#1a1a2e', muted: bg.isDark ? 'rgba(240,235,220,0.5)' : 'rgba(26,26,46,0.5)' };

  // Build HTML with before/main/after structure
  let html = '';

  if (parsed.before) {
    html += '<div class="p0-before" style="color:' + c.muted + '">' + escapeHtml(parsed.before) + '</div>';
  }

  html += '<div class="p0-main" style="color:' + c.main + '">' + escapeHtml(parsed.main) + '</div>';

  if (parsed.after) {
    html += '<div class="p0-after" style="color:' + c.muted + '">' + escapeHtml(parsed.after) + '</div>';
  }

  // Remove old treatment class, add new one
  for (let i = 0; i < TREATMENT_COUNT; i++) {
    container.classList.remove('typo-' + i);
  }
  container.classList.add('typo-' + treatmentIdx);
  container.innerHTML = html;

  currentTreatmentIdx = treatmentIdx;
}

// =====================================================================
// Shuffle
// =====================================================================

function randomTreatment(exclude) {
  if (TREATMENT_COUNT <= 1) return 0;
  let idx;
  do { idx = Math.floor(Math.random() * TREATMENT_COUNT); } while (idx === exclude);
  return idx;
}

async function doShuffle(container) {
  // Fade out
  container.classList.add('fading');
  await new Promise(function(r) { setTimeout(r, 250); });

  // Pick new combo
  var bg = pickRandomBackground(currentBg ? currentBg._idx : -1);
  var treatIdx = randomTreatment(currentTreatmentIdx);

  applyBg(bg);
  renderTypography(container, treatIdx, bg);

  // Fade in
  container.classList.remove('fading');
}

// =====================================================================
// Save / Load
// =====================================================================

function saveLocked() {
  var bgData;
  if (currentBg.type === 'unsplash') {
    bgData = {
      type: 'unsplash', url: currentBg.url, isDark: true,
      colors: currentBg.colors,
      photographer: currentBg.photographer,
      profileUrl: currentBg.profileUrl,
      downloadUrl: currentBg.downloadUrl
    };
  } else {
    bgData = {
      type: 'css', css: currentBg.css, isDark: currentBg.isDark,
      colors: currentBg.colors
    };
  }

  chrome.storage.local.set({
    p0_task: task,
    p0_date: todayKey(),
    p0_locked: true,
    p0_bg: bgData,
    p0_treatment: currentTreatmentIdx
  });
}

// =====================================================================
// Init
// =====================================================================

async function init() {
  var data = await chrome.storage.local.get([
    'p0_task', 'p0_date', 'p0_locked', 'p0_bg', 'p0_treatment'
  ]);

  var today = todayKey();

  // New day or no task → input state
  if (data.p0_date !== today || !data.p0_task) {
    if (data.p0_date && data.p0_date !== today) {
      chrome.storage.local.remove(['p0_task', 'p0_date', 'p0_locked', 'p0_bg', 'p0_treatment']);
    }
    showState('input');
    // Ensure light theme for input
    setTheme(false);
    document.body.classList.add('ready');
    setTimeout(function() { $taskInput.focus(); }, 100);
    return;
  }

  task = data.p0_task;
  document.title = task;

  if (data.p0_locked && data.p0_bg != null && data.p0_treatment != null) {
    // Locked state — restore saved design
    showState('locked');
    applyBg(data.p0_bg);
    renderTypography($lockedTypo, data.p0_treatment, data.p0_bg);
  } else {
    // Shuffle state — task set but not locked
    showState('shuffle');
    fetchUnsplashBatch(3);
    var bg = pickRandomBackground(-1);
    var treatIdx = randomTreatment(-1);
    applyBg(bg);
    renderTypography($shuffleTypo, treatIdx, bg);
  }

  document.body.classList.add('ready');
}

// =====================================================================
// Event Listeners
// =====================================================================

// Submit task
$taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  var text = $taskInput.value.trim();
  if (!text) return;

  task = text;
  document.title = task;

  chrome.storage.local.set({ p0_task: task, p0_date: todayKey(), p0_locked: false });

  showState('shuffle');
  fetchUnsplashBatch(3);

  var bg = pickRandomBackground(-1);
  var treatIdx = randomTreatment(-1);
  applyBg(bg);
  renderTypography($shuffleTypo, treatIdx, bg);
});

// Shuffle button
$shuffleBtn.addEventListener('click', function() {
  doShuffle($shuffleTypo);
});

// Lock in
$lockinBtn.addEventListener('click', function() {
  // Copy current design to locked container
  renderTypography($lockedTypo, currentTreatmentIdx, currentBg);
  showState('locked');
  saveLocked();
});

// Hover shuffle from locked state
$hoverBtn.addEventListener('click', async function() {
  await doShuffle($lockedTypo);
  saveLocked();
});

// Show hover button on mouse movement in locked state
document.addEventListener('mousemove', function() {
  if (currentState !== 'locked') return;
  $hoverBtn.classList.add('visible');
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(function() {
    $hoverBtn.classList.remove('visible');
  }, 2000);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.type === 'SET_P0' && msg.text) {
    task = msg.text.trim();
    document.title = task;
    chrome.storage.local.set({ p0_task: task, p0_date: todayKey(), p0_locked: false });
    chrome.storage.local.remove(['p0_bg', 'p0_treatment']);
    showState('shuffle');
    var bg = pickRandomBackground(-1);
    var treatIdx = randomTreatment(-1);
    applyBg(bg);
    renderTypography($shuffleTypo, treatIdx, bg);
  }
});

// Start
init();
