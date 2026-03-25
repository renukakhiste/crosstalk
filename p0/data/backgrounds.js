/**
 * Background pool for P0
 *
 * Each entry has:
 *   css      — the CSS background value
 *   isDark   — true if text should be light
 *   colors   — { main, muted } text colors matched to this background
 */

const BACKGROUNDS = [
  {
    id: 'warm-cream',
    css: 'linear-gradient(160deg, #faf3e8, #f0e4d1, #e8d5b8)',
    isDark: false,
    colors: { main: '#3d2e1a', muted: '#8a7560' }
  },
  {
    id: 'soft-pink',
    css: 'radial-gradient(ellipse at 50% 50%, #fcc8c8, #f5b0b0, #f09a9a)',
    isDark: false,
    colors: { main: '#5c1a1a', muted: '#9e5555' }
  },
  {
    id: 'teal-sky',
    css: 'linear-gradient(180deg, #8aabb5, #9abcc7, #aecdd8)',
    isDark: false,
    colors: { main: '#1a3d4d', muted: '#4a7a8a' }
  },
  {
    id: 'deep-forest',
    css: '#1a3328',
    isDark: true,
    colors: { main: '#c8ddc8', muted: '#6b8a6b' }
  },
  {
    id: 'navy',
    css: 'linear-gradient(160deg, #1a1a2e, #16213e, #0f3460)',
    isDark: true,
    colors: { main: '#c5cae9', muted: '#6a70a0' }
  },
  {
    id: 'fog',
    css: 'linear-gradient(180deg, #e8e4df, #d5cfc7, #c2bab0)',
    isDark: false,
    colors: { main: '#3a3530', muted: '#7a7570' }
  },
  {
    id: 'pure-black',
    css: '#0d0d0d',
    isDark: true,
    colors: { main: '#f0ebdc', muted: '#6b6860' }
  },
  {
    id: 'lavender',
    css: 'linear-gradient(135deg, #e8e0f0, #d5cce8, #c2b8e0)',
    isDark: false,
    colors: { main: '#2e1f4a', muted: '#7060a0' }
  },
  {
    id: 'peach-sunset',
    css: 'linear-gradient(135deg, #fce4ec, #e8d5e0, #c5cae9)',
    isDark: false,
    colors: { main: '#3a2040', muted: '#7a6080' }
  },
  {
    id: 'morning-sky',
    css: 'linear-gradient(180deg, #ffecd2, #fcb69f)',
    isDark: false,
    colors: { main: '#4a2010', muted: '#8a6050' }
  },
  {
    id: 'violet-hour',
    css: 'linear-gradient(135deg, #667eea, #764ba2)',
    isDark: true,
    colors: { main: '#f0ebdc', muted: '#c0b8d0' }
  },
  {
    id: 'ocean-deep',
    css: 'linear-gradient(180deg, #2c3e50, #4ca1af)',
    isDark: true,
    colors: { main: '#e0f0f0', muted: '#80aab5' }
  },
  {
    id: 'parchment',
    css: 'linear-gradient(160deg, #f5f0e8, #e8ddd0, #d4c5a9)',
    isDark: false,
    colors: { main: '#4a3a28', muted: '#8a7a68' }
  },
  {
    id: 'charcoal',
    css: 'linear-gradient(135deg, #1a1a1a, #2d2d2d, #1a1a1a)',
    isDark: true,
    colors: { main: '#e8e0d4', muted: '#7a7570' }
  },
  {
    id: 'fresh-mint',
    css: 'linear-gradient(180deg, #d4fc79, #96e6a1)',
    isDark: false,
    colors: { main: '#1a3a1a', muted: '#4a7a4a' }
  },
  {
    id: 'neon-dusk',
    css: 'linear-gradient(135deg, #f093fb, #f5576c)',
    isDark: true,
    colors: { main: '#ffffff', muted: '#ffd0d8' }
  },
  {
    id: 'sandstone',
    css: 'linear-gradient(160deg, #e6ddd4, #c9b99a)',
    isDark: false,
    colors: { main: '#3a3020', muted: '#7a6a50' }
  },
  {
    id: 'midnight',
    css: 'linear-gradient(180deg, #0c0c1d, #1a1a3e, #2a1a3e)',
    isDark: true,
    colors: { main: '#d0c8e0', muted: '#7a70a0' }
  },
  {
    id: 'emerald',
    css: 'linear-gradient(160deg, #064635, #0a5c45, #0e7355)',
    isDark: true,
    colors: { main: '#a8e6cf', muted: '#5aaa85' }
  },
  {
    id: 'dusty-rose',
    css: 'radial-gradient(ellipse, #d4a5a5, #c99393, #be8181)',
    isDark: false,
    colors: { main: '#401a1a', muted: '#7a4a4a' }
  }
];

/* =====================================================================
   Unsplash Integration
   ===================================================================== */

const UNSPLASH_ACCESS_KEY = 'yJM5obsw8eP0N7n_EfJ9STJtsYMKOjIR5b7nknuy5P8';
let unsplashPhotos = [];

async function fetchUnsplashBatch(count) {
  if (!UNSPLASH_ACCESS_KEY) return;
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?count=${count}&orientation=landscape&topics=nature,architecture,travel`,
      { headers: { Authorization: 'Client-ID ' + UNSPLASH_ACCESS_KEY } }
    );
    if (!res.ok) return;
    const photos = await res.json();
    for (const photo of photos) {
      const entry = {
        type: 'unsplash',
        url: photo.urls.regular,
        isDark: true,
        colors: { main: '#f0ebdc', muted: 'rgba(240,235,220,0.5)' },
        photographer: photo.user.name,
        profileUrl: photo.user.links.html,
        downloadUrl: photo.links.download_location
      };
      new Image().src = entry.url;
      unsplashPhotos.push(entry);
    }
  } catch (e) { /* CSS backgrounds are the fallback */ }
}

/**
 * Get all available backgrounds (CSS + any cached Unsplash photos)
 */
function getAllBackgrounds() {
  const all = BACKGROUNDS.map((bg, i) => ({ ...bg, type: 'css', _idx: i }));
  unsplashPhotos.forEach((bg, i) => {
    all.push({ ...bg, _idx: BACKGROUNDS.length + i });
  });
  return all;
}

/**
 * Pick a random background, avoiding the one at excludeIdx
 */
function pickRandomBackground(excludeIdx) {
  const all = getAllBackgrounds();
  if (all.length <= 1) return all[0] || BACKGROUNDS[0];
  let bg;
  do {
    bg = all[Math.floor(Math.random() * all.length)];
  } while (bg._idx === excludeIdx);
  return bg;
}
