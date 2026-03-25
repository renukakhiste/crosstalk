const quotes = [
  "Focus is saying no to a thousand good ideas. \u2014 Steve Jobs",
  "The main thing is to keep the main thing the main thing. \u2014 Stephen Covey",
  "Do the hard thing first. \u2014 Mark Twain",
  "It is not enough to be busy. The question is: what are we busy about? \u2014 Thoreau",
  "You can do anything, but not everything. \u2014 David Allen",
  "Simplicity is the ultimate sophistication. \u2014 Leonardo da Vinci",
  "Action expresses priorities. \u2014 Gandhi",
  "What is important is seldom urgent. \u2014 Eisenhower",
  "Less is more. \u2014 Mies van der Rohe",
  "The secret of getting ahead is getting started. \u2014 Mark Twain"
];

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}`;

  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
}

function showSection(id) {
  document.querySelectorAll('.task-section').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function loadTask() {
  chrome.storage.local.get(['p0_task', 'p0_date', 'p0_done'], (data) => {
    const today = getTodayKey();

    if (data.p0_date !== today) {
      // New day - reset
      chrome.storage.local.remove(['p0_task', 'p0_date', 'p0_done']);
      showSection('input-section');
      return;
    }

    if (data.p0_done) {
      document.getElementById('completed-task').textContent = data.p0_task;
      showSection('completed-display');
    } else if (data.p0_task) {
      document.getElementById('task-text').textContent = data.p0_task;
      showSection('task-display');
    } else {
      showSection('input-section');
    }
  });
}

document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const task = document.getElementById('task-input').value.trim();
  if (!task) return;

  chrome.storage.local.set({
    p0_task: task,
    p0_date: getTodayKey(),
    p0_done: false
  }, () => {
    document.getElementById('task-text').textContent = task;
    showSection('task-display');
  });
});

document.getElementById('complete-btn').addEventListener('click', () => {
  chrome.storage.local.get(['p0_task'], (data) => {
    chrome.storage.local.set({ p0_done: true }, () => {
      document.getElementById('completed-task').textContent = data.p0_task;
      showSection('completed-display');
    });
  });
});

document.getElementById('clear-btn').addEventListener('click', () => {
  chrome.storage.local.remove(['p0_task', 'p0_done'], () => {
    showSection('input-section');
    document.getElementById('task-input').value = '';
    document.getElementById('task-input').focus();
  });
});

// Random quote
document.getElementById('quote').textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Clock
updateClock();
setInterval(updateClock, 10000);

// Load task
loadTask();
