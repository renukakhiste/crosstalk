/**
 * Bundled background definitions
 * Each background has a CSS value and metadata for text color adaptation.
 * isDark: true means the background is dark, so text should be light.
 *
 * textColor overrides give us that "designed" feel — color-matched text
 * instead of generic black/white.
 */

const BUNDLED_BACKGROUNDS = [
  {
    id: 'warm-cream',
    css: 'linear-gradient(160deg, #faf3e8, #f0e4d1, #e8d5b8)',
    isDark: false,
    textColor: '#3d2e1a',          // warm brown on cream
    textColorMuted: '#8a7560',
    category: 'warm'
  },
  {
    id: 'soft-pink',
    css: 'radial-gradient(ellipse at 50% 50%, #fcc8c8, #f5b0b0, #f09a9a)',
    isDark: false,
    textColor: '#5c1a1a',          // deep rose on pink
    textColorMuted: '#9e5555',
    category: 'warm'
  },
  {
    id: 'deep-teal-sky',
    css: 'linear-gradient(180deg, #8aabb5, #9abcc7, #aecdd8, #c5dde5)',
    isDark: false,
    textColor: '#1a3d4d',          // dark teal on teal
    textColorMuted: '#4a7a8a',
    category: 'cool'
  },
  {
    id: 'dark-forest',
    css: 'linear-gradient(160deg, #1a3328, #1e3a2e, #1a3328)',
    isDark: true,
    textColor: '#c8ddc8',          // soft green on forest
    textColorMuted: '#6b8a6b',
    category: 'dark'
  },
  {
    id: 'moody-navy',
    css: 'linear-gradient(160deg, #1a1a2e, #16213e, #0f3460)',
    isDark: true,
    textColor: '#c5cae9',          // lavender on navy
    textColorMuted: '#6a70a0',
    category: 'dark'
  },
  {
    id: 'foggy-neutral',
    css: 'linear-gradient(180deg, #e8e4df, #d5cfc7, #c2bab0)',
    isDark: false,
    textColor: '#3a3530',          // charcoal brown
    textColorMuted: '#7a7570',
    category: 'neutral'
  },
  {
    id: 'warm-sage',
    css: 'linear-gradient(145deg, #2d3a2d, #3d4a3d, #4a5a4a, #5a6b5a)',
    isDark: true,
    textColor: '#d4e0c8',          // light sage on dark sage
    textColorMuted: '#8aa078',
    category: 'dark'
  },
  {
    id: 'sunset-peach',
    css: 'linear-gradient(135deg, #fce4ec, #e8d5e0, #c5cae9, #b3e5fc)',
    isDark: false,
    textColor: '#3a2040',          // deep plum on peach
    textColorMuted: '#7a6080',
    category: 'warm'
  },
  {
    id: 'pure-black',
    css: '#0d0d0d',
    isDark: true,
    textColor: '#f0ebdc',          // warm cream on black
    textColorMuted: '#6b6860',
    category: 'dark'
  },
  {
    id: 'lavender-mist',
    css: 'linear-gradient(135deg, #e8e0f0, #d5cce8, #c2b8e0)',
    isDark: false,
    textColor: '#2e1f4a',          // deep purple on lavender
    textColorMuted: '#7060a0',
    category: 'cool'
  },
  {
    id: 'ocean-blue',
    css: 'linear-gradient(180deg, #dfe6e9, #b2bec3, #74b9ff, #0984e3)',
    isDark: false,
    textColor: '#0a2540',          // deep navy on ocean
    textColorMuted: '#3a6590',
    category: 'cool'
  },
  {
    id: 'terracotta',
    css: 'linear-gradient(160deg, #d4a373, #c8956e, #bc8768)',
    isDark: false,
    textColor: '#3a1a08',          // deep brown on terracotta
    textColorMuted: '#6b4530',
    category: 'warm'
  },
  {
    id: 'dusty-rose',
    css: 'radial-gradient(ellipse, #d4a5a5, #c99393, #be8181)',
    isDark: false,
    textColor: '#401a1a',          // deep burgundy on rose
    textColorMuted: '#7a4a4a',
    category: 'warm'
  },
  {
    id: 'charcoal',
    css: 'linear-gradient(180deg, #2d2d2d, #1a1a1a)',
    isDark: true,
    textColor: '#e8e0d4',          // warm off-white on charcoal
    textColorMuted: '#7a7570',
    category: 'dark'
  },
  {
    id: 'morning-sky',
    css: 'linear-gradient(180deg, #ffecd2, #fcb69f)',
    isDark: false,
    textColor: '#4a2010',          // deep orange-brown
    textColorMuted: '#8a6050',
    category: 'warm'
  },
  // Additional gradients for variety
  {
    id: 'midnight-blue',
    css: 'linear-gradient(135deg, #0c1445, #1a237e, #283593)',
    isDark: true,
    textColor: '#b3c6ff',          // light blue on midnight
    textColorMuted: '#5a6eb0',
    category: 'dark'
  },
  {
    id: 'soft-sand',
    css: 'linear-gradient(180deg, #f5f0e8, #e8ddd0, #dbd0c0)',
    isDark: false,
    textColor: '#4a3a28',          // espresso brown
    textColorMuted: '#8a7a68',
    category: 'neutral'
  },
  {
    id: 'emerald-deep',
    css: 'linear-gradient(160deg, #064635, #0a5c45, #0e7355)',
    isDark: true,
    textColor: '#a8e6cf',          // mint on emerald
    textColorMuted: '#5aaa85',
    category: 'dark'
  },
  {
    id: 'blush',
    css: 'linear-gradient(135deg, #fde2e4, #fad2e1, #e2ece9, #dbecf4)',
    isDark: false,
    textColor: '#3a2030',          // deep plum
    textColorMuted: '#8a6878',
    category: 'warm'
  },
  {
    id: 'slate-storm',
    css: 'linear-gradient(180deg, #4a5568, #2d3748, #1a202c)',
    isDark: true,
    textColor: '#e2e8f0',          // cool gray-white
    textColorMuted: '#8a95a5',
    category: 'dark'
  }
];
