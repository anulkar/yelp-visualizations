// Path to Yelp Business JSON dataset
yelpBizData = "http://127.0.0.1:5000/";

// Define all the base map layers: Streets and Dark styles
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
};

// Create our map, giving it the streetmap view by default; we will add overlays later
var myMap = L.map("yelp-map", {
    center: [43.651070, -79.347015],
    zoom: 10,
    layers: [streetmap]
});

// Read the JSON dataset using d3
d3.json(yelpBizData).then(yelpData => {
    displaySummaryStats(yelpData);
    displayCityMap(yelpData);
    //populateData(yelpData);
});

function displaySummaryStats(yelpData) {

    d3.select("#businesses-count").text(yelpData.length);

    var reviewsArray = yelpData.map(yD => {
        return yD.review_count;
    });

    var averageReviews = Math.round(calculateAverage(reviewsArray));
    d3.select("#average-reviews").text(averageReviews);

    var starsArray = yelpData.map(yD => {
        return yD.stars;
    });

    var averageStars = calculateAverage(starsArray).toFixed(1);
    d3.select("#average-stars").text(averageStars);
}

function calculateAverage(arrayOfNumbers) {
    const total = arrayOfNumbers.reduce((a, b) => a + b, 0);
    return total / arrayOfNumbers.length;
}

function displayCityMap(yelpData) {
    // Define array to hold markers for businesses
    var businessMarkers = [];

    for (var i = 0; i < yelpData.length; i++) {
        var coordinates = [];
        coordinates.push(yelpData[i].latitude);
        coordinates.push(yelpData[i].longitude)
        businessMarkers.push(L.marker(coordinates)
            .bindPopup(yelpData[i].name)
            .addTo(myMap));
        console.log("Created Business Marker: " + businessMarkers.length);
        if (businessMarkers.length == 10) {
            break;
        }
    }

    // Create a layer group for businesses
    var businesses = L.layerGroup(businessMarkers);

    // Create an overlay object
    var overlayMaps = {
        "Businesses": businesses
    };

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}

function populateData(yelpData) {
    // Get a reference to the dropdown list
    var dropDownFilter = d3.select("#dropdown-filter");

    var filterArray = yelpData.map(yD => {
        return yD.state;
    });
    
    //De-dup the array, sort and save
    filterArray = Array.from(new Set(filterArray)).sort();
    console.log(filterArray);

    // Populate the  dropdown filter with the new array of values
    dropDownFilter.selectAll("option")
        .data(filterArray)
        .enter()
        .append("option")
        .text(value => {return value;});
}