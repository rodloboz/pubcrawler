import Banner01 from 'images/banner_01.jpg';
import Banner02 from 'images/banner_02.jpg';
import Banner03 from 'images/banner_03.jpg';
import Banner04 from 'images/banner_04.jpg';

function activateNeonBannerText() {
  let textHolder = document.getElementById('banner-text'),
    text = textHolder.innerHTML,
    chars = text.length,
    newText = '',
    i;

  for (i = 0; i < chars; i += 1) {
    newText += '<i>' + text.charAt(i) + '</i>';
  }

  textHolder.innerHTML = newText;

  let letters = document.getElementsByTagName('i'),
    flickers = [5, 7, 9, 11, 13, 15, 17],
    randomLetter,
    flickerNumber,
    counter;

  function randomFromInterval(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }

  function hasClass(element, cls) {
      return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function flicker() {
    counter += 1;

    if (counter === flickerNumber) {
      return;
    }

    setTimeout(function () {
      if(hasClass(randomLetter, 'off')) {
        randomLetter.className = '';
      }
      else {
        randomLetter.className = 'off';
      }

      flicker();
    }, 30);
  }

  (function loop() {
      let rand = randomFromInterval(500,1500);

    randomLetter = randomFromInterval(0, 6);
    randomLetter = letters[randomLetter];

    flickerNumber = randomFromInterval(0, 8);
    flickerNumber = flickers[flickerNumber];

      setTimeout(function() {
              counter = 0;
              flicker();
              loop();
      }, rand);
  }());
}

const smoothScroll = function() {
  const arrow = document.querySelector('.fa-chevron-down');

  if (arrow) {
    arrow.addEventListener('click', () => {
      window.scrollTo(0, window.innerHeight - 70);
    });
  }
};

export { activateNeonBannerText, smoothScroll };

