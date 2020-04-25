yelpBizData = "http://127.0.0.1:5000/";

d3.json(yelpBizData).then(function(yelpdata) {
    //console.log(yelpdata);
    var ydata = yelpdata
    var reviewcounts = ydata.map(row => row.review_count)
   // console.log(reviewcounts)
    var yelpstars= ydata.map(row=> row.stars)
    //console.log(yelpstars)

// Create Dataset using anychary.js Library
  
  var dataset = anychart.data.set(ydata);
  //console.log(dataset);
  // Map data
  var mapping = dataset.mapAs({x:"stars", value:"review_count"});

  // create the chart
  var chart = anychart.scatter(mapping);

  // set the container

  chart.container("stars-reviews-plot");

  // Intiate drawing the chart

  chart.draw();

});

d3.json(yelpBizData).then(function(tipsdata) {
  //console.log(tipsdata);
  var tdata = tipsdata
 
  // Map the tips in the database
  var tips = tdata.map(row => row.text)

  // Join the tips to create one string
  tips = tips.join(" ")

// console.log(tips);

// create the chart using anychary.js Library
var chart = anychart.tagCloud();

// Set up criteria for tagCloud
chart.data(tips, {
  mode: "by-word",
  maxItems: 800,
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
               ]
  });

// Set up the tooltip to display the % of words in the sample
chart.tooltip().format("{%yPercentOfTotal}% ({%value})\n\n{%custom_field}");


// set the container

chart.container("tips-cloud");

// Intiate drawing the chart

chart.draw();


});