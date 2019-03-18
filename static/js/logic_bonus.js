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

// API endpoint for earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// API endpoint for techtonic plate data
var techtonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Create circle markers
function createCircleMarker(feature, latlng) {
    // Set the color of the circles based on magnitude size
    var pointColor = function (magnitude) {
        if (magnitude >= 5) return "red"
        if (magnitude >= 4) return "orange"
        if (magnitude >= 3) return "gold"
        if (magnitude >= 2) return "yellow"
        if (magnitude >= 1) return "LemonChiffon"
        return "lightgreen"
    }
    
    // Scale the size of the circle radius based on magnitude size
    var pointRadius = function (magnitude) {
        return magnitude * 2.5
    }
    
    // Set the properties of the circle markers
    let styles = {
        radius: pointRadius(feature.properties.mag),
        fillColor: pointColor(feature.properties.mag),
        color: "none",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75
    }
    return L.circleMarker(latlng, styles);
}

// Get the data and add it to the map
d3.json(queryUrl, function (data) {
    L.geoJSON(data, {
        pointToLayer: createCircleMarker, // Call the createCircleMarker function to create the circle for this layer
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + " (Magnitude: " + feature.properties.mag + ")" + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    }).addTo(myMap);

    // Set up the legend and add it to the map   
    var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend');
        var labels = [],
        categories = ['0-1', '1-2', '2-3', '3-4', '4-5','5+'];
        var colors = ['lightgreen', 'LemonChiffon', 'yellow', 'gold', 'orange', 'red']

        var legendInfo = "<h3>Magnitude</h3>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + categories[0] + "</div>" +
          "<div class=\"max\">" + categories[categories.length - 1] + "</div>" +
        "</div>";
  
        div.innerHTML = legendInfo;
  
        categories.forEach(function(category, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
  
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };    
    legend.addTo(myMap);
});