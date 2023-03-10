function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
};

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
   //console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    //console.log(samplesArray);

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(resultArray1);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata
    //console.log(metaData);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0]; 
    //console.log(firstSample);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var resultMetadata = metaData[0];
    //console.log(resultMetadata);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    //console.log(otuIDs);

    var labels = result.otu_labels.slice(0,10).reverse();
    //console.log(otuLabels);

    var values = result.sample_values.slice(0,10).reverse();
    //console.log(sampleValues);

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wFreq = resultMetadata.wfreq;
    //console.log(wFreq);
  
    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last.

    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();
    //console.log(yticks);


    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: ids, 
      y: yticks, 
      text: labels,
      type: "bar", 
      orientation: "h",
      text: labels
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found", 
    };
  
    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleValues = result.sample_values;
    //console.log(bubbleValues);

    var bubbleLabels = result.otu_labels;
    //console.log(bubbleLabels)
    

    var bubbleData = [{
      x: ids, 
      y: bubbleValues, 
      text: bubbleLabels,
      mode: "markers", 
      marker: { 
        size: bubbleValues
      }
   }];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample", 
      hovermode: "closest", 
      yaxis: {title: "OTU ID"}
   };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeTrace =[{
      domain: { x: [0,2], y: [0,2]},
      value: wFreq, 
      title: {text: "Scrubs per Week"}, 
      type: "indicator", 
      mode: "gauge+number", 
      gauge: { axis: {visible: true, range: [0,10]}}
    }];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, 
      height: 500, 
      margin: {t: 0, b: 0}
    }; 

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeTrace, gaugeLayout);

  })
}; 