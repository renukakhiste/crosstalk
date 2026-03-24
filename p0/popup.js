/**
 * P0 — Popup Logic
 *
 * Allows the user to change their P0 mid-day from the Chrome toolbar.
 * Sends a message to any open new tab pages so they update instantly.
 */

const $input = document.getElementById('popup-input');
const $current = document.getElementById('popup-current');

// Show the current P0 if one is set
async function loadCurrent() {
  const data = await chrome.storage.local.get('p0Text');
  if (data.p0Text) {
    $current.textContent = `Current P0: "${data.p0Text}"`;
  }
}

// Handle Enter key — save the new P0 and notify new tab pages
$input.addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter') return;

  const text = $input.value.trim();
  if (text.length === 0) return;

  // Save to storage
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  await chrome.storage.local.set({
    p0Text: text,
    lastSetDate: dateStr
  });

  // Clear locked state so the new tab re-enters shuffle mode
  await chrome.storage.local.remove(['lockedBackground', 'lockedTypography']);

  // Notify any open new tab pages
  const tabs = await chrome.tabs.query({});
  tabs.forEach(tab => {
    // Send to all tabs — the new tab page will handle it, others will ignore
    chrome.tabs.sendMessage(tab.id, { type: 'SET_P0', text }).catch(() => {
      // Ignore errors for tabs that don't have our content script
    });
  });

  // Update the display and close
  $current.textContent = `Updated! "${text}"`;
  $input.value = '';

  // Close the popup after a brief moment
  setTimeout(() => window.close(), 800);
});

// Focus the input on open
$input.focus();
loadCurrent();
