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
