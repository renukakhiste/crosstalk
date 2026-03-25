/**
 * P0 — Background Service Worker
 * Handles daily reset via alarm.
 */

const ALARM_NAME = 'p0-daily-reset';

chrome.runtime.onInstalled.addListener(function() {
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1, periodInMinutes: 60 });
});

chrome.runtime.onStartup.addListener(function() {
  chrome.alarms.create(ALARM_NAME, { delayInMinutes: 1, periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener(async function(alarm) {
  if (alarm.name !== ALARM_NAME) return;

  var data = await chrome.storage.local.get('p0_date');
  if (!data.p0_date) return;

  var d = new Date();
  var today = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  if (data.p0_date !== today) {
    await chrome.storage.local.remove([
      'p0_task', 'p0_date', 'p0_locked', 'p0_bg', 'p0_treatment'
    ]);
  }
});
