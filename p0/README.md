# P0

**Your new tab, your highest priority. One thing. Every day.**

P0 replaces your Chrome new tab page with the single most important thing you need to do today — displayed as bold editorial typography on a beautiful, calm background. No to-do lists, no weather, no quotes, no widgets. Just your one thing, staring back at you, beautifully.

---

## How It Works

1. **Open a new tab** → You see: *"What's your P0 today?"*
2. **Type your one thing** and press Enter
3. **Shuffle** through background + typography combos until you find the right vibe
4. **Lock in** → Your priority fills the screen. Pure. Nothing else.
5. **Every new tab** for the rest of the day shows your locked P0 instantly
6. **Next morning** → Fresh start. New day, new priority.

## Design Philosophy

This app is ALL design. The typography, the backgrounds, and how text interacts with the background IS the product.

- **Purist**: Just the sentence. No time, no date, no greeting.
- **Editorial**: Typography feels like a poster, a magazine cover, a brand campaign.
- **Smart emphasis**: The app intelligently identifies power words in your sentence and makes them visually dominant — action verbs are HUGE, connectors are quiet.
- **Color-matched**: Text colors are tuned to each background, not generic black/white.

## Install

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked**
5. Select the `p0/` folder
6. Open a new tab — you're ready!

## Unsplash Integration (Optional)

P0 works perfectly with just the 20 built-in CSS gradient backgrounds. But if you want beautiful photography backgrounds too:

1. Go to [Unsplash Developers](https://unsplash.com/developers) and create a free account
2. Create a new application to get your **Access Key**
3. Open `p0/newtab.js` and find this line near the top:
   ```js
   const UNSPLASH_ACCESS_KEY = '';
   ```
4. Paste your access key between the quotes:
   ```js
   const UNSPLASH_ACCESS_KEY = 'your-access-key-here';
   ```
5. Reload the extension in `chrome://extensions/`

The free tier gives you 50 requests per hour — more than enough for shuffling.

## Typography Treatments

P0 includes 10 distinct editorial typography styles:

| # | Font | Style |
|---|------|-------|
| 0 | Playfair Display 900 | Bold stacked serif, left-aligned, tight line-height |
| 1 | DM Serif Display | Mixed-weight editorial, key words italic |
| 2 | Plus Jakarta Sans 800 | Heavy geometric sans, punchy |
| 3 | Cormorant Garamond 700 | Elegant centered serif |
| 4 | Fraunces 800 | Characterful variable serif, earthy |
| 5 | Bebas Neue | Condensed all-caps poster |
| 6 | Lora 700 | Warm editorial serif, right-aligned |
| 7 | Outfit 700 | Modern rounded bold sans |
| 8 | Cormorant Garamond | Classic italic contrast |
| 9 | Space Grotesk 700 | Tight geometric display |

## Smart Word Emphasis

The killer feature. P0 parses your sentence and applies visual hierarchy:

- **Action verbs** (Ship, Launch, Fix, Nail) → HUGE and bold
- **Important nouns** (design review, pitch deck) → Large and prominent
- **Connectors** (the, for, with, to) → Small, quiet, muted

Example: *"Ship the onboarding redesign"*
→ **SHIP** appears massive on its own line, *"the onboarding redesign"* as a subtitle.

## Changing Your P0 Mid-Day

Click the P0 icon in your Chrome toolbar → type your new priority → press Enter.

## Project Structure

```
p0/
├── manifest.json          # Chrome extension manifest v3
├── newtab.html            # The new tab page
├── newtab.css             # All styles + typography treatments
├── newtab.js              # Main logic
├── popup.html             # Toolbar popup for changing P0
├── popup.css              # Popup styles
├── popup.js               # Popup logic
├── background.js          # Service worker (daily reset alarm)
├── fonts.css              # Google Fonts imports
├── lib/
│   └── emphasis.js        # Smart word emphasis engine
├── data/
│   └── backgrounds.js     # Bundled background definitions
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Tech Stack

- Vanilla JavaScript (ES6+)
- CSS custom properties
- Chrome Extension Manifest V3
- Google Fonts
- Unsplash API (optional)

## Future Roadmap

- [ ] Firefox extension support
- [ ] Custom photo upload for backgrounds
- [ ] Theme packs (dark mode, seasonal, minimal)
- [ ] Keyboard shortcut to open P0 input
- [ ] History of past P0s
- [ ] Widget for macOS/Windows desktop
