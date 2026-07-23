const endDateTimeInput = document.getElementById('endDateTime');
const startCountdownBtn = document.getElementById('startCountdownBtn');
const countdownDisplay = document.getElementById('countdownDisplay');
const countdownStatus = document.getElementById('countdownStatus');

let countdownInterval = localStorage.getItem('Countdown Interval') ? parseInt(localStorage.getItem('Countdown Interval')) : null;
let targetTime = localStorage.getItem('Target Time') ? parseInt(localStorage.getItem('Target Time')) : null;
countdownDisplay.textContent = localStorage.getItem('Countdown Display') ? localStorage.getItem('Countdown Display') : '00:00:00:00';
if (localStorage.getItem('Countdown Status') == 'Running' && targetTime > Date.now())
   countdownStatus.textContent = 'Countdown is running...';
else if (localStorage.getItem('Countdown Status') == 'Stopped' || targetTime <= Date.now())
   countdownStatus.textContent = 'Choose a target date/time to begin.';
endDateTimeInput.value = targetTime ? new Date(targetTime).toISOString().slice(0, 16) : '';

function initComp() {
   if (!localStorage.getItem('Countdown Display')) {
      localStorage.setItem('Countdown Display', '00:00:00:00');
   }
   if (!localStorage.getItem('Countdown Status')) {
      localStorage.setItem('Countdown Status', 'Stopped');
   }
   if (!localStorage.getItem('Target Time')) {
      localStorage.setItem('Target Time', null);
   }
   if (!localStorage.getItem('Countdown Interval')) {
      localStorage.setItem('Countdown Interval', null);
   }
}

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

function renderCd() {
   if (!targetTime) {
      return;
   }

   const now = Date.now();
   const remainingMs = targetTime - now;
   // localStorage.setItem('remainingMs', remainingMs);

   if (localStorage.getItem('Target Time') <= Date.now()) {
      countdownDisplay.textContent = '00:00:00:00';
      countdownStatus.textContent = 'Choose a target date/time to begin.';
      localStorage.setItem('Countdown Status', 'Stopped');
      localStorage.setItem('Countdown Display', '00:00:00:00');
      localStorage.setItem('Target Time', null);
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
   }
   else if (localStorage.getItem('Target Time') > Date.now()) {
      const totalSeconds = Math.floor(remainingMs / 1000);
      countdownDisplay.textContent = formatTime(totalSeconds);
      countdownStatus.textContent = 'Countdown is running...';
      localStorage.setItem('Countdown Display', countdownDisplay.textContent);
      localStorage.setItem('Countdown Status', 'Running');
   }
}

function loadCd() {
   renderCd();
   countdownInterval = setInterval(renderCd, 1000);
   localStorage.setItem('Countdown Interval', countdownInterval);
}

startCountdownBtn.addEventListener('click', function () {
   if (!endDateTimeInput.value) {
      countdownStatus.textContent = 'Please select an end date and time first.';
      localStorage.setItem('Countdown Status', "Error: No date/time selected.");
      localStorage.setItem('Target Time', null);
      localStorage.setItem('Countdown Display', '00:00:00:00');
      return;
   }
   else
   {
      targetTime = new Date(endDateTimeInput.value).getTime();
      localStorage.setItem('Target Time', targetTime);
      
      if (Number.isNaN(localStorage.getItem('Target Time'))) {
         countdownStatus.textContent = 'Invalid date/time selected.';
         localStorage.setItem('Countdown Status', 'Error: Invalid date/time selected.');
         localStorage.setItem('Target Time', null);
         localStorage.setItem('Countdown Display', '00:00:00:00');
         return;
      }

      if (localStorage.getItem('Target Time') < Date.now()) {
         countdownStatus.textContent = 'Selected time has already passed.';
         localStorage.setItem('Countdown Status', 'Error: Selected time has already passed.');
         localStorage.setItem('Target Time', null);
         localStorage.setItem('Countdown Display', '00:00:00:00');
         return;
      }

      if (countdownInterval) {
         clearInterval(countdownInterval);
      }
      loadCd()
      // renderCd();
      // countdownInterval = setInterval(renderCd, 1000);
      // localStorage.setItem('Countdown Interval', countdownInterval);
   }
   // renderCd();
   // countdownInterval = setInterval(renderCd, 1000);
   // localStorage.setItem('Countdown Interval', countdownInterval);
});

initComp();
loadCd();
// renderCd();
// countdownInterval = setInterval(renderCd, 1000);
// localStorage.setItem('Countdown Interval', countdownInterval);