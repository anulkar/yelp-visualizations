// Path to Yelp Business JSON dataset
yelpBizData = "assets/data/yelp_converted_business_dataset_records.json";

// Read the JSON dataset using d3
d3.json(yelpBizData).then(yelpData => {
    populateData(yelpData);
});

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