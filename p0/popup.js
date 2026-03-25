function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
}

function showPopupSection(id) {
  document.querySelectorAll('#popup-has-task, #popup-completed, #popup-no-task').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function loadPopup() {
  chrome.storage.local.get(['p0_task', 'p0_date', 'p0_done'], (data) => {
    const today = getTodayKey();

    if (data.p0_date !== today) {
      chrome.storage.local.remove(['p0_task', 'p0_date', 'p0_done']);
      showPopupSection('popup-no-task');
      document.getElementById('popup-input').focus();
      return;
    }

    if (data.p0_done) {
      showPopupSection('popup-completed');
    } else if (data.p0_task) {
      document.getElementById('popup-task-text').textContent = data.p0_task;
      showPopupSection('popup-has-task');
    } else {
      showPopupSection('popup-no-task');
      document.getElementById('popup-input').focus();
    }
  });
}

document.getElementById('popup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const task = document.getElementById('popup-input').value.trim();
  if (!task) return;

  chrome.storage.local.set({
    p0_task: task,
    p0_date: getTodayKey(),
    p0_done: false
  }, () => {
    document.getElementById('popup-task-text').textContent = task;
    showPopupSection('popup-has-task');
  });
});

document.getElementById('popup-done-btn').addEventListener('click', () => {
  chrome.storage.local.set({ p0_done: true }, () => {
    showPopupSection('popup-completed');
  });
});

document.getElementById('popup-clear-btn').addEventListener('click', () => {
  chrome.storage.local.remove(['p0_task', 'p0_done'], () => {
    showPopupSection('popup-no-task');
    document.getElementById('popup-input').value = '';
    document.getElementById('popup-input').focus();
  });
});

loadPopup();
