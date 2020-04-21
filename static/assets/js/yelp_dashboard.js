// Path to Yelp Business JSON dataset
yelpBizData = "http://127.0.0.1:5000/";

//Read the JSON dataset using d3
d3.json(yelpBizData).then(yelpData => {
    console.log(yelpData)
    displaySummaryStats(yelpData);
    populateData(yelpData);
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