import './application.css';
import "bootstrap";
import GMaps from 'gmaps/gmaps.js';
import { autocomplete } from '../components/autocomplete';
import { activateNeonBannerText, smoothScroll } from '../components/home';
import { toggleNavbarBackground } from '../components/navbar';
import { loadMap } from '../components/map';
import ReallySmoothScroll from 'really-smooth-scroll';
import { toggleIcons } from '../components/pub';
import { reactToModalChange } from '../components/modals';
import { loadMapbox } from '../components/mapbox';
import Rails from 'rails-ujs';



Rails.start();
autocomplete();
toggleNavbarBackground();
toggleIcons();
reactToModalChange();

const homePage = document.querySelector('.pages.home');
if (homePage) {
  ReallySmoothScroll.shim();
  activateNeonBannerText();
  smoothScroll();
}

const pubsIndex = document.querySelector('.pubs.index');
if (pubsIndex) {
  loadMap();
}

const crawlsIndex = document.querySelector('.crawls.index');
if (crawlsIndex) {
  loadMapbox();
}


