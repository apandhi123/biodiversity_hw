function buildMetadata(sample) {
  var PANEL = `/metadata/${sample}`
  d3.json(PANEL).then(function(response){

    var data2 = d3.select("#sample-metadata");

    // clears any existing metadata
    data2.html("");
 
    Object.entries(response).forEach(([key, value]) => {
    data2.append("h6").text(`${key}: ${value}`);
 });

});
};


      // if (error) return console.log(error);
      // console.log(response);
      // var data = response[0];
      // console.log(data)
      // var metaList = document.getElementById('sampleMetadata');
      // metaList.innerHTML = '';
      // var metaItems = [["Sample","SAMPLEID"],["Ethnicity","ETHNICITY"],["Gender","GENDER"],["Age","AGE"],
      //     ["Weekly Wash Frequency","WFREQ"],["Type (Innie/Outie)","BBTYPE"],["Country","COUNTRY012"],["Dog Owner","DOG"],["Cat Owner","CAT"]];
      // console.log(metaList)
      // for(i=0; i<metaItems.length; i++){
      //     var newLi = document.createElement('li');
      //     newLi.innerHTML = `${metaItems[i][0]}: ${data[metaItems[i][1]]}`;
      //     metaList.appendChild(newLi);
     



function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sampleData = `/samples/${sample}`;
    d3.json(sampleData).then(function(response) {
      var topTenOtuIds = response.otu_ids.slice(0,10);
      var topOtuLabels = response.otu_labels.slice(0,10);
      var topTenSampleValues = response.sample_values.slice(0,10);

      var data = [{
        values: topTenSampleValues,
        labels: topTenOtuIds,
        hovertext: topOtuLabels,
        type: 'pie'
      }];
      var layout = {
        height: 600,
        width: 600
        };
     Plotly.newPlot('pie', data, layout);

// Use otu_ids for the x values

// Use sample_values for the y values

// Use sample_values for the marker size

// Use otu_ids for the marker colors

// Use otu_labels for the text values

      var bubbleData = `/samples/${sample}`;
      d3.json(bubbleData).then(function(response) {

      var IDs = response.otu_ids;
      var bubbleValues = response.sample_values;
      var otuDescriptions = [];
      
      var Data = [{
          x: IDs,
          y: bubbleValues,
          mode: 'markers',
          // type: 'scatter',
          marker: {
              size: bubbleValues,
              color: IDs,
              colorscale: 'Rainbow'
          },
          text: otuDescriptions,
      }];




      var bubbleLayout = {
        title: 'Sample Values for ' + sample,
        xaxis: {title: "OTU ID"},
        hovermode: 'closest',
        showlegend: false,
        height: 600,
        margin:
            {
                top: 10,
                bottom: 10,
                right: 10,
                left: 10
            }
    };
      
      // var data1 = [trace]
      Plotly.newPlot("bubble", Data, bubbleLayout)
    });

  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
