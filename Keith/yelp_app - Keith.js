function init() {
  var selector = d3.select("#selDataset");
  //Read samples.json
  d3.json("yelp_toronto_business_summary_records.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildGaugeChart(newSample);
  //buildBubbleChart(newSample);
}

function buildMetadata(sample) {
  d3.json("yelp_toronto_business_summary_records.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);
    var resultArray = metadata.filter(sampleObj => sampleObj.parent == sample);
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
  function buildGaugeChart(sample) {
    d3.json("yelp_toronto_business_summary_records.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata
      .filter(sampleObj => {
        return sampleObj.parent == sample
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
      Plotly.newPlot('gauge', gauge_trace, gauge_layout)
    
    });
  
  }
