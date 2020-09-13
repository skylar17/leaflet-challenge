// Create initial map object
var myMap = L.map("map", {
    center: [37.6000, -95.6650],
    zoom: 5
  });

// Create the tile layer that will be the background of our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// ------------------------------------------------

d3.json(geoData, function(data) {
    function createFeatures(feature) {
      return {
        stroke: true,
        opacity: 1,
        fillOpacity: 0.75,
        color: "white",
        fillColor: getColor(feature.properties.mag),
        radius: getRadius(feature.properties.mag),
        weight: 0.5
      };
    }


      function getColor(magnitude) {
        return magnitude > 5 ? '#800026' :
              magnitude > 4 ? '#BD0026' :
              magnitude > 3 ? '#E31A1C' :
              magnitude > 2 ? '#FC4E2A' :
              magnitude > 1 ? '#FD8D3C' :
              magnitude > 0 ? '#FEB24C' :
                              '#FFEDA0';
      }
    

      function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 4;
      }


      // GeoJSON layer
      L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        


  style: createFeatures,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
    }).addTo(myMap);
    

// ---------------------------------

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {

      var div = L.DomUtil.create('div', 'info legend');
          var grades = [0, 1, 2, 3, 4, 5];
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

legend.addTo(myMap);


});
