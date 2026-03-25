// Set up daily reset alarm
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('daily-reset', {
    when: getNextMidnight(),
    periodInMinutes: 24 * 60
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-reset') {
    chrome.storage.local.remove(['p0_task', 'p0_date', 'p0_done']);
  }
});

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return midnight.getTime();
}
