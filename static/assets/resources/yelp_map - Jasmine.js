
// yelpBizData = "http://127.0.0.1:5000/";

// Create a map object
var myMap = L.map("map", {
  center: [43.65, -79.38],
  zoom: 10
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

//Pull in data with D3
d3.json("yelp_toronto_business_dataset_records.json", function businesslocations(data) {
  console.log(data);

  var marker = [];

  for (var i = 0; i < data.length; i++) {

    var location = [data[i].latitude, data[i].longitude];
    
    if (data[i].stars >= 5) {
    if (location) {

      marker.push(L.marker(location)
        .bindPopup("<dt>" + data[i].name + "</dt>" 
                   + "<dt>" + data[i].address + "</dt>"
                   + "<dt>" + data[i].parent+ "</dt>")
        .addTo(myMap));
    }
  }
}
});


