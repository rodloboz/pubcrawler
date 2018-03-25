import GMaps from 'gmaps/gmaps.js';
import blackMarkerPng from 'images/map-marker-black.png';
import redMarkerPng from 'images/map-marker-red.png';
// import clusterPinSvg from 'images/cluster-pin.svg';
// import CustomMarker from './marker';
import styles from './styles';
import dynamics from 'dynamics.js';

CustomMarker.prototype = new google.maps.OverlayView();

function CustomMarker(opts) {
    this.setValues(opts);
}

CustomMarker.prototype.onAdd = function() {
  var self = this;
    var div = this.div;
    if (!div) {
        div = this.div = $('' +
            '<div>' +
            '<div class="shadow"></div>' +
            '<div class="pulse"></div>' +
            '<div class="pin-wrap">' +
            '<div class="pin"></div>' +
            '</div>' +
            '</div>' +
            '')[0];
        this.pinWrap = this.div.getElementsByClassName('pin-wrap');
        this.pin = this.div.getElementsByClassName('pin');
        this.pinShadow = this.div.getElementsByClassName('shadow');
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
        this.animateDrop();
        google.maps.event.addDomListener(div, "click", function(event) {
            google.maps.event.trigger(self, "click", event);
        });
    }
}

CustomMarker.prototype.draw = function() {
    var self = this;
    var point = this.getProjection().fromLatLngToDivPixel(this.position);
    var div = this.div;
    if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
    }
};

CustomMarker.prototype.animateDrop = function() {
    dynamics.stop(this.pinWrap);
    dynamics.css(this.pinWrap, {
        'transform': 'scaleY(2) translateY(-'+$('#map').outerHeight()+'px)',
        'opacity': '1',
    });
    dynamics.animate(this.pinWrap, {
        translateY: 0,
        scaleY: 1.0,
    }, {
        type: dynamics.gravity,
        duration: 1800,
    });

    dynamics.stop(this.pin);
    dynamics.css(this.pin, {
        'transform': 'none',
    });
    dynamics.animate(this.pin, {
        scaleY: 0.8
    }, {
        type: dynamics.bounce,
        duration: 1800,
        bounciness: 600,
    })

    dynamics.stop(this.pinShadow);
    dynamics.css(this.pinShadow, {
        'transform': 'scale(0,0)',
    });
    dynamics.animate(this.pinShadow, {
        scale: 1,
    }, {
        type: dynamics.gravity,
        duration: 1800,
    });
}

CustomMarker.prototype.animateBounce = function() {
    dynamics.stop(this.pinWrap);
    dynamics.css(this.pinWrap, {
        'transform': 'none',
    });
    dynamics.animate(this.pinWrap, {
        translateY: -30
    }, {
        type: dynamics.forceWithGravity,
        bounciness: 0,
        duration: 500,
        delay: 150,
    });

    dynamics.stop(this.pin);
    dynamics.css(this.pin, {
        'transform': 'none',
    });
    dynamics.animate(this.pin, {
        scaleY: 0.8
    }, {
        type: dynamics.bounce,
        duration: 800,
        bounciness: 0,
    });
    dynamics.animate(this.pin, {
        scaleY: 0.8
    }, {
        type: dynamics.bounce,
        duration: 800,
        bounciness: 600,
        delay: 650,
    });

    dynamics.stop(this.pinShadow);
    dynamics.css(this.pinShadow, {
        'transform': 'none',
    });
    dynamics.animate(this.pinShadow, {
        scale: 0.6,
    }, {
        type: dynamics.forceWithGravity,
        bounciness: 0,
        duration: 500,
        delay: 150,
    });
}

CustomMarker.prototype.animateWobble = function() {
    dynamics.stop(this.pinWrap);
    dynamics.css(this.pinWrap, {
        'transform': 'none',
    });
    dynamics.animate(this.pinWrap, {
        rotateZ: -45,
    }, {
        type: dynamics.bounce,
        duration: 1800,
    });

    dynamics.stop(this.pin);
    dynamics.css(this.pin, {
        'transform': 'none',
    });
    dynamics.animate(this.pin, {
        scaleX: 0.8
    }, {
        type: dynamics.bounce,
        duration: 800,
        bounciness: 1800,
    });
}

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
