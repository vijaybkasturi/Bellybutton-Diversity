function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log("firstSample: " + firstSample);
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
  d3.json("static/js/data/samples.json").then((data) => {
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
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    console.log("samplesArray: ", samplesArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);
    console.log("filteredSample: ", resultSamples);

    //  5. Create a variable that holds the first sample in the array.
    var resultSample = resultSamples[0];
    console.log("filteredFirstSample: ", resultSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = resultSample.otu_ids;
    var otu_labels = resultSample.otu_labels.slice(0, 10);
    var sample_values = resultSample.sample_values.slice(0, 10).reverse();
    console.log("OTU_IDs: ", otu_ids);
    console.log("OTU_Lables: ", otu_labels);
    console.log("sample_values: ", sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ((otu_ids.slice(0, 10)).reverse()).map(a => "OTU " + a);
    console.log("Y axis: ", yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    }

    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "linear",
      },
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: resultSample.sample_values,
      mode: "markers",
      // marker: {
      //   size: resultSample.sample_values,
      //   color: resultSample.otu_ids
      // },
      text: resultSample.otu_labels,
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
         size: resultSample.sample_values,
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title: "OTU ID"},
      height: 500,
      width: 1000
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample)
    console.log("metadata: ", metadataArray);

    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstSample = metadataArray[0];
    console.log("firstSample: ", firstSample);
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var wfreq = Object.values(firstSample)[6];
    console.log("washing freq: ", wfreq);
       
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], tickwidth:1, tickcolor: "#000082" },
        bar: {color: "black"},
        steps:[
          {range: [0, 2], color: "red" },
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "darkgreen"},
        ],
        threshold: {
         // line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490,
        },
      },
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width:400, height: 225, margin: {t:0, b:0}};
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
