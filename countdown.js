const endDateTimeInput = document.getElementById('endDateTime');
const startCountdownBtn = document.getElementById('startCountdownBtn');
const countdownDisplay = document.getElementById('countdownDisplay');
const countdownStatus = document.getElementById('countdownStatus');

let countdownInterval = localStorage.getItem('countdownInterval') ? parseInt(localStorage.getItem('countdownInterval')) : null;
let targetTime = localStorage.getItem('targetTime') ? parseInt(localStorage.getItem('targetTime')) : null;
countdownDisplay.textContent = localStorage.getItem('remainingMs') ? formatTime(Math.floor(localStorage.getItem('remainingMs') / 1000)) : '00:00:00:00';
countdownStatus.textContent = localStorage.getItem('countdownStatus') ? localStorage.getItem('countdownStatus') : 'Choose a target date/time to begin.';

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
const remainingMs;
while(remainingMs > 0)
{
   remainingMs = targetTime - now;
   if (localStorage.getItem('remainingMs') == 0) {
   countdownDisplay.textContent = '00:00:00:00';
   countdownStatus.textContent = 'Choose a target date/time to begin.';
   localStorage.setItem('countdownStatus', 'Stopped');
   localStorage.setItem('remainingMs', null);
   clearInterval(countdownInterval);
   countdownInterval = null;
   return;
   }

   const totalSeconds = Math.floor(remainingMs / 1000);
   countdownDisplay.textContent = formatTime(totalSeconds);
   countdownStatus.textContent = 'Countdown is running...';
   localStorage.setItem('countdownDisplay', countdownDisplay.textContent);
   localStorage.setItem('countdownStatus', 'Running');
}}

startCountdownBtn.addEventListener('click', function () {
   if (!endDateTimeInput.value) {
      countdownStatus.textContent = 'Please select an end date and time first.';
      localStorage.setItem('countdownStatus', "Error: No date/time selected.");
      localStorage.setItem('remainingMs', null);
      return;
   }

   targetTime = new Date(endDateTimeInput.value).getTime();
   localStorage.setItem('targetTime', targetTime);

   if (Number.isNaN(localStorage.getItem('targetTime'))) {
      countdownStatus.textContent = 'Invalid date/time selected.';
      localStorage.setItem('countdownStatus', 'Error: Invalid date/time selected.');
      localStorage.setItem('remainingMs', null);
      return;
   }

   if (localStorage.getItem('targetTime') < Date.now()) {
      countdownStatus.textContent = 'Selected time has already passed.';
      localStorage.setItem('countdownStatus', 'Error: Selected time has already passed.');
      localStorage.setItem('remainingMs', null);
      return;
   }

   if (localStorage.getItem('targetTime') > Date.now()) {
      renderCountdown();
      // countdownInterval = setInterval(renderCountdown, 1000);
      // localStorage.setItem('countdownInterval', countdownInterval);
   }

   if (countdownInterval) {
      clearInterval(countdownInterval);
   }

   // renderCountdown();
   // countdownInterval = setInterval(renderCountdown, 1000);
   // localStorage.setItem('countdownInterval', countdownInterval);
});

function loadCountdown()
{
   renderCountdown();
   countdownInterval = setInterval(renderCountdown, 1000);
   localStorage.setItem('countdownInterval', countdownInterval);
}

loadCountdown();