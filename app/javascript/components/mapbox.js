import mapboxgl from 'mapbox-gl';
import redMarkerPng from 'images/map-marker-red.png';


const loadMapbox = function() {

  const mapElement = document.getElementById('map');
  const features = JSON.parse(mapElement.dataset.features);
  const redMarker = 'https://' + window.location.host + redMarkerPng;
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  const start = [-9.1370, 38.7083];

  function addMarkers(map) {
    map.addLayer({
          "id": "points",
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
        addMarkers(map);
      });

      const bounds = new mapboxgl.LngLatBounds();

      features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates);
      });

      map.fitBounds(bounds, {
            padding: 50
        });
  });
}

export { loadMapbox };
