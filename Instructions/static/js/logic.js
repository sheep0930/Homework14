function getColor(mag) {
    if (mag>5){
      return '#f45f42';
    }
    else if (mag>4) {
      return '#f48641';
    }
    else if (mag>3) {
      return '#f49a41';
    }
    else if (mag>2) {
      return '#f4cd41';
    }
    else if (mag>1) {
      return '#f4f141';
    }
    else {
      return "#97f441";
    }
}

function getRadius(value){
    return value*50000
}

// Creating map object
var myMap = L.map("map", {
  center: [36.4102, -98.8022],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

// Grab data with d3
d3.json(APILink, function(data) {
  console.log(data.features)
  geojson = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng, 
          {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .8,
          color: "white",
          weight: 1

      })
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  }).addTo(myMap);
 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5],   
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

  return div;
};

legend.addTo(myMap);

});
