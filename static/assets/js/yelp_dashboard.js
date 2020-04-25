// API URLs to retrieve Yelp JSON datasets
yelpBizData = "http://127.0.0.1:5000/businesses/toronto";
yelpSummaryData = "http://127.0.0.1:5000/businesses/toronto/summary_data";

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

d3.json(yelpSummaryData).then(ySummaryData => {
    console.log(ySummaryData)
    initializeCategories(ySummaryData);
});

function initializeCategories(ySummaryData) {
    var selector = d3.select("#category-filter");

    var categories = ySummaryData[0].names;

    // Populate the dropdown filter with the list of categories
    selector.selectAll("option")
        .data(categories)
        .enter()
        .append("option")
        .text(value => {return value;});
}
  
function optionChanged(category) {
    //buildMetadata(category);
   // buildGaugeChart(category);
    //buildBubbleChart(newSample);
}

function buildMetadata(category) {
    d3.json(yelpSummaryData).then((ySummaryData) => {
        var metadata = ySummaryData.metadata;
        console.log(metadata);
        var resultArray = metadata.filter(sampleObj => sampleObj.parent == category);
        console.log(resultArray);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        
        Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(key.toUpperCase() + ': ' + value); 
        })
    });
}

// The gauge chart
function buildGaugeChart(category) {
    d3.json(yelpSummaryData).then((ySD) => {
    
    var metadata = ySD.metadata;
    var resultArray = metadata
    .filter(sampleObj => {
        return sampleObj.parent == category
    });
    console.log(resultArray);

    var result = resultArray[0];
    console.log(result);
    var avg_review = result.average_review;
    console.log(avg_review);

    // creating trace and formatting
    var gauge_trace = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: avg_review,
        title: {text: "Category Average Review", font: {size: 18}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [0, 5]},
            bar: { color: "steelblue" },
            steps: [
            { range: [0, 1], color: 'rgba(183,28,28, .5)' },
            { range: [1, 2], color: 'rgba(255,179,71, .5)' },
            { range: [2, 3], color: 'rgba(253,253,150, .5)' },
            { range: [3, 4], color: 'rgba(14, 127, 0, .5)' },
            { range: [4, 5], color: 'rgba(174,198,207, .5)' }
            ],
        }  
        }
    ];
    
    // set the layout for gauge 
    var gauge_layout = {
        
        
        width: 600, 
        height: 500, 
        margin: { t: 0, b: 0 }
    };
    
    // create the gauge
    Plotly.newPlot('gauge-plot', gauge_trace, gauge_layout)
    
    });

}

// Read the JSON dataset using d3
d3.json(yelpBizData).then(yelpData => {
    displaySummaryStats(yelpData);
    displayCityMap(yelpData);
    buildReviewsVsStarsChart(yelpData);
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
    d3.select("#average-stars-summary").text(averageStars);
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
        // console.log("Created Business Marker: " + businessMarkers.length);
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

function buildReviewsVsStarsChart(yelpData)
{   
    // Create Dataset using anychart.js Library
    var dataset = anychart.data.set(yelpData);
    //console.log(dataset);
    // Map data
    var mapping = dataset.mapAs({x:"stars", value:"review_count"});

    // create the chart
    var chart = anychart.scatter(mapping);

    // set the container
    chart.container("reviews-stars-scatter-plot");

    // Intiate drawing the chart
    chart.draw();

    // **** Commented code below for same scatter plot using Plotly.js instead ****
    // ----------------------------------------------------------------------------
    // var starsArray = yelpData.map(yD => {
    //     return yD.stars;
    // });

    // var reviewsArray = yelpData.map(yD => {
    //     return yD.review_count;
    // });
    // var trace1 = {
    //     x: starsArray,
    //     y: reviewsArray,
    //     mode: 'markers',
    //     type: 'scatter',
    //     name: 'Stars vs Reviews',
    //     marker: { size: 12 }
    //   };

    // var data = [trace1];

    // var layout = {
    //     title:'Stars Vs Reviews'
    // };

    // Plotly.newPlot('yelp-viz', data, layout);
    // ----------------------------------------------------------------------------
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