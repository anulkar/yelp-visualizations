// Setup Host and Port Info for the API URLs
host = "http://localhost:";
port = "5000";

// Build API URL to retrieve top 3 cities from Yelp's JSON dataset stored locally in MongoDB
yelpCities = host + port + "/businesses/top_3_cities";

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

var myMap = L.map("yelp-map", {
    center: [39.381266, -97.922211],
    zoom: 4,
    layers: [streetmap]
});

// Create a layer control and add base maps to the map
var layerControl = L.control.layers(baseMaps).addTo(myMap);
layerControl.expand();

d3.json(yelpCities).then(yelpCity => {
    populateCityFilter(yelpCity);
});

function cityChanged(city) {
    // Build all API URLs to retrieve Yelp's JSON dataset stored locally in MongoDB
    yelpBizData = host + port + "/businesses/" + city;
    yelpSummaryData = host + port + "/businesses/" + city + "/summary_data";
    yelpBizCatData = host + port + "/businesses/" + city + "/biz_cat_summary";
    yelpTipsData = host + port + "/businesses/" + city + "/tips";
    yelpCheckinsData = host + port + "/businesses/" + city + "/checkins";

    d3.json(yelpBizData).then(yelpData => {
        displaySummaryStats(yelpData);
        displayCityMap(yelpData, city);
        buildReviewsVsStarsChart(yelpData, city);
    });
    
    d3.json(yelpCheckinsData).then(yCData => {
        displayTotalCheckins(yCData);
    });

    d3.json(yelpSummaryData).then(ySummaryData => {
        initializeCategories(ySummaryData);
    });

    d3.json(yelpBizCatData).then(yBizCatData => {
        buildBizCategoriesBarChart(yBizCatData, city);
    });

    d3.json(yelpTipsData).then(yTipsData => {
        buildTipsTagCloud(yTipsData);
    });
}

function populateCityFilter(yelpCity) {
    var selector = d3.select("#city-filter");

    var cities = yelpCity.map(yCity => {
        return yCity._id;
    });
    // Populate the dropdown filter with the list of categories
    selector.selectAll("option")
        .data(cities)
        .enter()
        .append("option")
        .text(value => {return value;});

    cityChanged(cities[0]);
}

function displayTotalCheckins(yCData) {

    var checkinDates = yCData.map(yCD => {
        return yCD.date;
    });

    var totalCheckins = 0;
    checkinDates.map(checkinDate => {
        totalCheckins = totalCheckins + checkinDate.split(',').length;
    });

    d3.select("#total-checkins").text(totalCheckins.toLocaleString('en-US'));
};

function displaySummaryStats(yelpData) {

    d3.select("#businesses-count").text(yelpData.length.toLocaleString('en-US'));

    var reviewsArray = yelpData.map(yD => {
        return yD.review_count;
    });

    var averageReviews = Math.round(calculateAverage(reviewsArray));
    d3.select("#average-reviews").text(averageReviews.toLocaleString('en-US'));

    var starsArray = yelpData.map(yD => {
        return yD.stars;
    });

    var averageStars = calculateAverage(starsArray).toFixed(1);
    d3.select("#average-stars-summary").text(averageStars.toLocaleString('en-US'));
}

function buildBizCategoriesBarChart(yBizCatData, city) {

    // Create Dataset using anychart.js Library
    var dataset = anychart.data.set(yBizCatData);
    // Create Dataset using anychart.js Library
    var mapping = dataset.mapAs({x:"parent", value:"business_count"});
    // create the chart
    var chart = anychart.bar(mapping);

    // enable major grids
    chart.xGrid().enabled(false);
    chart.yGrid().enabled(true);
    // enable minor grids
    chart.xMinorGrid().enabled(false);
    chart.yMinorGrid().enabled(true);

    chart.xAxis().title("Category");//create name for X axis
    chart.yAxis().title("Business Count"); //create name for Y axis
    chart.title("Business Count by Category for " + city); // setting title
    chart.data(yBizCatData); //specify data source
    chart.yScale().stackMode('value');//setting percent stacking
    // var legend = chart.legend(); 
    // var barSpacing = 20; // desired space between each bar
    // var scaleY = 100; // 10x scale on rect height

    // label rotation
    var xAxisLabels = chart.xAxis().labels();
    xAxisLabels.enabled(false);

    // format mouse over pop up
    chart.tooltip().title("Category Data"); //configuring the tooltip
    chart.tooltip().format("Category: {%parent} \nCount: {%value} \nPercent of Total: {%yPercentOfTotal}{decimalsCount:1}%");

    // set the container
    chart.container("biz-cat-bar-chart"); //reference the container Id

    // Intiate drawing the chart
    chart.draw();
}

function initializeCategories(ySummaryData) {
    var selector = d3.select("#category-filter");

    var categories = ySummaryData.map(ySData => {
        return ySData.parent;
    });

    // Populate the dropdown filter with the list of categories
    selector.selectAll("option")
        .data(categories)
        .enter()
        .append("option")
        .text(value => {return value;});
    
    buildGaugeChart(categories[0]);
}

function optionChanged(category) {
    //buildMetadata(category);
    buildGaugeChart(category);
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
    var averageStars;
    d3.json(yelpSummaryData).then(ySData => {
        ySData.map(data => {
            if (data.parent == category) {
                averageStars = data.average_review;
                // Build the gauge chart
                var data = [{
                    type: "indicator",
                    mode: "gauge+number",
                    value: averageStars,
                    title: { text: "Average Stars for <i>" + category + "</i>", font: { size: 14 } },
                    gauge: {
                        axis: { range: [null, 5]},
                        bar: { color: "f15c00" },
                        bgcolor: "white",
                        borderwidth: 2,
                        bordercolor: "white",
                        steps: [
                            { range: [0, 1], color: "009ee3", text: "0-1" },
                            { range: [1, 2], color: "00a3c9" },
                            { range: [2, 3], color: "00a6aa" },
                            { range: [3, 4], color: "00a989" },
                            { range: [4, 5], color: "2eac66" },
                        ]
                    }
                }];
                
                // Build the layout for the gauge chart
                var layout = {
                    margin: { t: 25, r: 25, l: 25, b: 25 },
                    paper_bgcolor: "white",
                };
                
                // Plot the gauge chart using plotly
                Plotly.newPlot('stars-gauge-plot', data, layout); 
            }
        });
    });
}

function buildTipsTagCloud(yTipsData) {

    // Map the tips in the database
    var tips = yTipsData.map(row => row.text)

    // Join the tips to create one string
    tips = tips.join(" ")

    // create the chart using anychary.js Library
    var chart = anychart.tagCloud();

    // Set up criteria for tagCloud
    chart.data(tips, {
        mode: "by-word",
        maxItems: 1500,
        ignoreItems: [
                        "the",
                        "and",
                        "he",
                        "or",
                        "of",
                        "in",
                        "a",
                        "to",
                        "is",
                        "for",
                        "they",
                        "be",
                        "an",
                        "do",
                        "so",
                        "it",
                        "its",
                        "with",
                        "at",
                        "i",
                        "we",
                        "on",
                        "up",
                        "are",
                        "was",
                        "if",
                        "too"
                    ]
    });

    // Set up the tooltip to display the % of words in the sample
    chart.tooltip().format("{%yPercentOfTotal}% ({%value})");
    // Set the title
    chart.title("Most Common Words Found in Tips left by Yelpers");
    // set the container
    chart.container("tips-tag-cloud");
    // Intiate drawing the chart
    chart.draw();
}

function calculateAverage(arrayOfNumbers) {
    const total = arrayOfNumbers.reduce((a, b) => a + b, 0);
    return total / arrayOfNumbers.length;
}

function displayCityMap(yelpData, city) {

    var cityCoordinates = []
    if (city == "Las Vegas")
        cityCoordinates = [36.114647, -115.172813];
    else if
        (city == "Phoenix")
        cityCoordinates = [33.448376, -112.074036];
    else // Toronto
        cityCoordinates = [43.651070, -79.347015];
        
    // Create our map, giving it the streetmap view by default; we will add overlays later
    // myMap.panTo(new L.LatLng(33.448376, -112.074036), 10);
    myMap.setView(cityCoordinates, 10);

    // Define array to hold markers for businesses
    var businessMarkers = [];

    for (var i = 0; i < yelpData.length; i++) {
        var coordinates = [];
        coordinates.push(yelpData[i].latitude);
        coordinates.push(yelpData[i].longitude)
        businessMarkers.push(L.marker(coordinates)
            .bindPopup(yelpData[i].name)
            .addTo(myMap));
        if (businessMarkers.length == 50) {
            break;
        }
    }
    // Create a layer group for businesses
    //var businesses = L.layerGroup(businessMarkers);

    // // Create an overlay object
    // var overlayMaps = {
    //     "Businesses": businesses
    // };

    // Pass in the overlayMap to the layer control
    // Add the layer control to the map
    //layerControl.addOverlay(businessMarkers, "Businesses").addTo(myMap);
    layerControl.expand();
}

function buildReviewsVsStarsChart(yelpData, city)
{   
    // Create Dataset using anychart.js Library
    var dataset = anychart.data.set(yelpData);
    //console.log(dataset);
    // Map data
    var mapping = dataset.mapAs({x:"stars", value:"review_count"});
   
    // create the chart
    scatterChart = anychart.scatter(mapping);

    // enable major grids
    scatterChart.xGrid(true);
    scatterChart.yGrid(true);

    // configure the visual settings of major grids
    scatterChart.xGrid().stroke({color: "#85adad", thickness: 0.7});
    scatterChart.yGrid().stroke({color: "#85adad", thickness: 0.7});

    // enable minor grids
    scatterChart.xMinorGrid(true);
    scatterChart.yMinorGrid(true);

    // configure the visual settings of minor grids
    scatterChart.xMinorGrid().stroke({color: "#85adad", thickness: 0.3, dash: 5});
    scatterChart.yMinorGrid().stroke({color: "#85adad", thickness: 0.3, dash: 5});

    // set the chart title
    scatterChart.xAxis().title("Stars (Rating)");//create name for X axis
    scatterChart.yAxis().title("Review Count"); //create name for Y axis

    scatterChart.title("Review Counts by Stars (Rating) for " + city); 

    // set the container
    scatterChart.container("reviews-stars-scatter-plot");

    // Intiate drawing the chart
    scatterChart.draw();

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

    // Plotly.newPlot('reviews-stars-scatter-plot', data, layout);
    // ----------------------------------------------------------------------------
}