/**
 * P0 — Background Service Worker
 *
 * Handles the daily reset alarm. Every 60 minutes, checks if the date
 * has changed. If it has, clears the saved P0 so the user sees the
 * input screen fresh the next morning.
 */

const ALARM_NAME = 'p0-daily-reset';

// Set up the alarm on install and on browser start
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 1,          // First check 1 minute after install
    periodInMinutes: 60         // Then every hour
  });
});

// Also ensure the alarm exists on startup (in case it was cleared)
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 1,
    periodInMinutes: 60
  });
});

// When the alarm fires, check if the date has rolled over
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const data = await chrome.storage.local.get('lastSetDate');
  if (!data.lastSetDate) return;   // Nothing to reset

  const today = getTodayString();
  if (data.lastSetDate !== today) {
    // New day! Clear the P0 so the user gets a fresh start
    await chrome.storage.local.remove([
      'p0Text',
      'lockedBackground',
      'lockedTypography'
    ]);
  }
});

function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
