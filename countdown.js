const endDateTimeInput = document.getElementById('endDateTime');
const startCountdownBtn = document.getElementById('startCountdownBtn');
const countdownDisplay = document.getElementById('countdownDisplay');
const countdownStatus = document.getElementById('countdownStatus');

let countdownInterval = null;
let targetTime = null;

function formatTime(totalSeconds) {
const safeSeconds = Math.max(0, totalSeconds);
const days = Math.floor(safeSeconds / 86400);
const hours = Math.floor((safeSeconds % 86400) / 3600);
const minutes = Math.floor((safeSeconds % 3600) / 60);
const seconds = safeSeconds % 60;

return [days, hours, minutes, seconds]
   .map((value) => String(value).padStart(2, '0'))
   .join(':');
}

function renderCountdown() {
if (!targetTime) {
   return;
}

const now = Date.now();
const remainingMs = targetTime - now;

if (remainingMs <= 0) {
   countdownDisplay.textContent = '00:00:00';
   countdownStatus.textContent = 'Countdown complete.';
   clearInterval(countdownInterval);
   countdownInterval = null;
   return;
}

const totalSeconds = Math.floor(remainingMs / 1000);
countdownDisplay.textContent = formatTime(totalSeconds);
countdownStatus.textContent = 'Countdown is running...';
}

startCountdownBtn.addEventListener('click', function () {
if (!endDateTimeInput.value) {
   countdownStatus.textContent = 'Please select an end date and time first.';
   return;
}

targetTime = new Date(endDateTimeInput.value).getTime();

if (Number.isNaN(targetTime)) {
   countdownStatus.textContent = 'Invalid date/time selected.';
   return;
}

if (targetTime <= Date.now()) {
   countdownStatus.textContent = 'Selected time has already passed.';
   return;
}

if (countdownInterval) {
   clearInterval(countdownInterval);
}

renderCountdown();
countdownInterval = setInterval(renderCountdown, 1000);
});