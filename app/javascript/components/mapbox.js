import mapboxgl from 'mapbox-gl';
import redMarkerPng from 'images/map-marker-red.png';
import blackMarkerPng from 'images/map-marker-black.png';


const loadMapbox = function() {

  const mapElement = document.getElementById('map');
  const features = JSON.parse(mapElement.dataset.features);
  const redMarker = window.location.origin + redMarkerPng;
  const blackMarker = window.location.origin + blackMarkerPng;
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  const start = [-9.1370, 38.7083];
  const navigateBtn = document.getElementById('navigateBtn');

  function flyToFeature(target) {
    map.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: target,
        zoom: 18,
        bearing: 0,
        pitch: 50,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.5, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
            return t;
        }
    });

  }

  function addRedMarkers(map) {
    map.addLayer({
          "id": "points-red",
          "type": "symbol",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": features
              }
          },
          "layout": {
              "icon-image": "cat",
              "icon-size": 1,
              "icon-allow-overlap": true
          }
      });
  }

  function addBlackMarkers(map) {
    map.addLayer({
          "id": "points-black",
          "type": "symbol",
          "source": {
              "type": "geojson",
              "data": {
                  "type": "FeatureCollection",
                  "features": features
              }
          },
          "layout": {
              "icon-image": "cat",
              "icon-size": 1,
              "icon-allow-overlap": true
          }
      });
  }

  mapboxgl.accessToken = token;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: start,
    bearing: 0,
    zoom: 9,
    attributionControl: false,
    scrollZoom: false
  });

  map.addControl(new mapboxgl.NavigationControl());

  // The 'building' layer in the mapbox-streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', function() {
      // Insert the layer beneath any symbol layer.
      let layers = map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
              labelLayerId = layers[i].id;
              break;
          }
      }

      map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
              'fill-extrusion-color': '#aaa',

              // use an 'interpolate' expression to add a smooth transition effect to the
              // buildings as the user zooms in
              'fill-extrusion-height': [
                  "interpolate", ["linear"], ["zoom"],
                  15, 0,
                  15.05, ["get", "height"]
              ],
              'fill-extrusion-base': [
                  "interpolate", ["linear"], ["zoom"],
                  15, 0,
                  15.05, ["get", "min_height"]
              ],
              'fill-extrusion-opacity': .6
          }
      }, labelLayerId);

      map.loadImage(redMarker, function(error, image) {
        if (error) throw error;
        map.addImage('cat', image);
        addRedMarkers(map);
      });

      map.loadImage(blackMarker, function(error, image) {
        if (error) throw error;
        map.addImage('black', image);
        addBlackMarkers(map);
      });

      const bounds = new mapboxgl.LngLatBounds();

      features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates);
      });

      map.fitBounds(bounds, {
          padding: 50
      });

      const center = map.getCenter();

      features.forEach(function (feature, index){
        const pub = document.getElementById('pub-' + feature.id);

        pub.addEventListener('mouseover', function (e) {
          map.flyTo({
            center: features[index].geometry.coordinates,
            zoom: 14,
            pitch: 50
          });

        });
        pub.addEventListener('mouseleave', function (e) {
          map.fitBounds(bounds, {
            padding: 50
          });
          // map.flyTo({
          //   center: center,
          //   pitch: 0
          // });
        });
      });

      const popups = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
      });

      map.on('click', 'points-red', function(e) {
          // Change the cursor style as a UI indicator.
          map.flyTo({
            center: e.features[0].geometry.coordinates,
            pitch: 50
          });
          // Populate the popup and set its coordinates
          // based on the feature found.
          popups.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
        });

        map.on('mouseleave', 'points-red', function() {
          setTimeout(function() {
            map.getCanvas().style.cursor = '';
            popups.remove();
          }, 1500);
        });

        navigateBtn.addEventListener('click', () => {
          console.log('fly clicked')
          flyToFeature(features[0].geometry.coordinates);
          features.forEach((feature) => {
            map.once('moveend', function(e){
              flyToFeature(feature.geometry.coordinates)
            });
          });
        });
  });
}

export { loadMapbox };
