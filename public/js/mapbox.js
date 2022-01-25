/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY29sdG1hcCIsImEiOiJja3lxNnV1Mm8waDhjMzFtbXZ5ZjhpZWQ0In0.Rexn7w877QGJqI6mXujAOA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/coltmap/ckyq7qxw9istq16n2oof20ueb',
    scrollZoom: false,
    // center: [-118.220181, 33.88581],
    // zoom: 5,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
