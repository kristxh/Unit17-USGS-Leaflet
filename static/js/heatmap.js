// Create a map object
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
});

// Add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data and create a heatmap
d3.json(queryUrl, function (response) {
    var heatArray = [];
    L.geoJSON(response, {
        onEachFeature: function (feature, layer) {
            heatArray.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
        }
    });
    var heat = L.heatLayer(heatArray, {
        radius: 15,
        maxOpacity: .9,
        minOpacity: .3
    }).addTo(myMap)
});
