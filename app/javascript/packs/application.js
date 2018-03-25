import './application.css';
import "bootstrap";
import Rails from 'rails-ujs';
import GMaps from 'gmaps/gmaps.js';
import ReallySmoothScroll from 'really-smooth-scroll';
import { autocomplete } from '../components/autocomplete';
import { activateNeonBannerText, smoothScroll } from '../components/home';
import { toggleNavbarBackground } from '../components/navbar';
import { initPubsIndexMap, initPubShowMap } from '../components/map';
import { toggleIcons } from '../components/pub';
import { toggleCrawlIcons } from '../components/crawl';
import { reactToModalChange } from '../components/modals';
import { loadMapbox } from '../components/mapbox';

Rails.start();
autocomplete();
toggleNavbarBackground();
toggleIcons();
toggleCrawlIcons();
reactToModalChange();

const homePage = document.querySelector('.pages.home');
if (homePage) {
  ReallySmoothScroll.shim();
  activateNeonBannerText();
  smoothScroll();
}

const pubsIndexPage = document.querySelector('.pubs.index');
if (pubsIndexPage) {
  initPubsIndexMap();
}

const pubShowPage = document.querySelector('.pubs.show');
if (pubShowPage) {
  initPubShowMap();
}

const crawlShowPage = document.querySelector('.crawls.show');
if (crawlShowPage) {
  loadMapbox();
}


