import flatpickr from 'flatpickr';

const toggleDateInputs = function() {
  const startDateinput = document.getElementById('crawl_start_date');

  if (startDateinput) {
    flatpickr(startDateinput);
  }
}

export { toggleDateInputs }


