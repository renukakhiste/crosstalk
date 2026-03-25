var $taskText = document.getElementById('task-text');
var $emptyText = document.getElementById('empty-text');
var $input = document.getElementById('popup-input');
var $clearBtn = document.getElementById('clear-btn');

function todayKey() {
  var d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}

// Load current
chrome.storage.local.get(['p0_task', 'p0_date'], function(data) {
  if (data.p0_date === todayKey() && data.p0_task) {
    $taskText.textContent = data.p0_task;
    $clearBtn.classList.remove('hidden');
  } else {
    $taskText.classList.add('hidden');
    $emptyText.classList.remove('hidden');
  }
});

// Enter to update
$input.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var text = $input.value.trim();
  if (!text) return;

  chrome.storage.local.set({ p0_task: text, p0_date: todayKey(), p0_locked: false });
  chrome.storage.local.remove(['p0_bg', 'p0_treatment']);

  // Notify open new tabs
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'SET_P0', text: text }).catch(function() {});
    });
  });

  $taskText.textContent = text;
  $taskText.classList.remove('hidden');
  $emptyText.classList.add('hidden');
  $clearBtn.classList.remove('hidden');
  $input.value = '';
  setTimeout(function() { window.close(); }, 600);
});

// Clear
$clearBtn.addEventListener('click', function() {
  chrome.storage.local.remove(['p0_task', 'p0_date', 'p0_locked', 'p0_bg', 'p0_treatment']);
  $taskText.textContent = '';
  $taskText.classList.add('hidden');
  $emptyText.classList.remove('hidden');
  $clearBtn.classList.add('hidden');
});

$input.focus();
