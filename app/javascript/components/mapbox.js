import mapboxgl from 'mapbox-gl';

const loadMapbox = function() {
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  const start = [-9.1370, 38.7083];

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
  });

}

export { loadMapbox };
