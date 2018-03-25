import GMaps from 'gmaps/gmaps.js';
import blackMarkerPng from 'images/map-marker-black.png';
import redMarkerPng from 'images/map-marker-red.png';
// import clusterPinSvg from 'images/cluster-pin.svg';
import styles from './styles';
import dynamics from 'dynamics.js';
import CustomMarker from './marker';

const blackMarker = window.location.origin + blackMarkerPng;
const redMarker = window.location.origin + redMarkerPng;
// const clusterPin = 'http://' + window.location.host + clusterPinSvg;

const initPubShowMap = function() {
  const mapElement = document.getElementById('map');
  const latlng = JSON.parse(mapElement.dataset.marker);
  if (mapElement) {
    const pos = new google.maps.LatLng(latlng[0], latlng[1]);
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: pos,
      disableDefaultUI: true,
      styles: styles
    });

    const marker = new CustomMarker({
          position: pos,
          map: map,
      });

    const drop = document.getElementById('drop');
    const wobble = document.getElementById('wobble');
    const bounce = document.getElementById('bounce');

    google.maps.event.addListener(marker, 'click', function(e) {
        marker.animateWobble();
    });

    google.maps.event.addListener(marker, 'mouseover', function(e) {
        console.log("hello")
        marker.animateWobble();
    });

    drop.addEventListener('click', function(e) {
        marker.animateDrop();
    });

    wobble.addEventListener('click', function(e) {
        marker.animateWobble();
    });

    bounce.addEventListener('click', function(e) {
        marker.animateBounce();
    })
  }
}

const initPubsIndexMap = function() {
  const mapElement = document.getElementById('map');
  if (mapElement) { // don't try to build a map if there's no div#map to inject in
    const map = new GMaps({
      el: '#map',
      lat: 0, lng: 0,
      streetViewControl: false,
      mapTypeControl: false,
      scrollwheel:  false
    });
    const markers = JSON.parse(mapElement.dataset.markers);
    const mapMarkers = map.addMarkers(markers);

    mapMarkers.forEach((marker, index) => {
      marker.addListener('click', () => {
        map.setCenter(markers[index]);
        markers[index].infoWindow.open(map, marker);
      })
    });

    if (markers.length === 0) {
      map.setZoom(2);
    } else if (markers.length === 1) {
      map.setCenter(markers[0].lat, markers[0].lng);
      map.setZoom(14);
    } else {
      map.fitLatLngBounds(markers);
    }

    const cards = document.querySelectorAll('.card-row');
    cards.forEach((card, index) => {
      const marker = mapMarkers[index];
      card.addEventListener('mouseover', () => {
        marker.setIcon(redMarker);
      });
      card.addEventListener('mouseout', () => {
        marker.setIcon(blackMarker);
      });
    })

    // const clusterOptions = {
    //   minimumClusterSize: 4,
    //   cssClass: 'map-cluster',
    //   styles: [
    //     {
    //       url: clusterPin,
    //       height: 24,
    //       width: 24,
    //       backgroundPosition: 'center'
    //     },
    //     {
    //       url: clusterPin,
    //       height: 64,
    //       width: 64,
    //       backgroundPosition: 'center'
    //     }
    //   ]
    // };
    // const markerCluster = new MarkerClusterer(
    //   map.map,
    //   mapMarkers,
    //   clusterOptions)

    map.addStyle({
      styles: styles,
      mapTypeId: 'map_style'
    });
    map.setStyle('map_style');
  }

}

export { initPubsIndexMap, initPubShowMap }
