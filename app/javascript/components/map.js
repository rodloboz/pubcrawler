import GMaps from 'gmaps/gmaps.js';
import blackMarkerPng from 'images/map-marker-black.png';
import redMarkerPng from 'images/map-marker-red.png';
// import clusterPinSvg from 'images/cluster-pin.svg';


const blackMarker = window.location.origin + blackMarkerPng;
const redMarker = window.location.origin + redMarkerPng;
// const clusterPin = 'http://' + window.location.host + clusterPinSvg;

const styles = [
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff5b00"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ff5b00"
            },
            {
                "lightness": "0"
            },
            {
                "gamma": "1.33"
            },
            {
                "saturation": "67"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fbdbc9"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f18a51"
            },
            {
                "saturation": "3"
            },
            {
                "lightness": "75"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "lightness": "-19"
            },
            {
                "gamma": "1.00"
            },
            {
                "saturation": "-10"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#ff3800"
            },
            {
                "saturation": "-74"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ff3800"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "lightness": "-5"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "lightness": "-19"
            },
            {
                "saturation": "-10"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "hue": "#ff3800"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbdbc9"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fbdbc9"
            },
            {
                "gamma": "0.4"
            },
            {
                "lightness": "27"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "lightness": "-6"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "saturation": "22"
            },
            {
                "lightness": "-47"
            },
            {
                "gamma": "1.72"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#fdfdfd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "saturation": "-10"
            },
            {
                "lightness": "-19"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.icon",
        "stylers": [
            {
                "saturation": "-67"
            },
            {
                "lightness": "0"
            },
            {
                "gamma": "1"
            },
            {
                "hue": "#ff3800"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            },
            {
                "lightness": "-11"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#fbd4c9"
            }
        ]
    }
]

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

export { initPubsIndexMap }
