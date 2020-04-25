anychart.onDocumentReady(function() {

    // load data
    anychart.data.loadJsonFile('yelp_toronto_business_dataset_records.json', function (data) {
  
      // create a chart
      chart = anychart.bubble(data);
      // set a chart title
      chart.title("Top 30 Grossing Movies");
      // set titles for axes
      chart.review_count().title("Reviews");
      chart.stars().title("Rating");
      // draw the chart
      chart.container("container").draw();
  
    })
  
  });