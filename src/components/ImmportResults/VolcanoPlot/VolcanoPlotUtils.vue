<template>
  <v-card outlined>
    <v-card-text>
      <plotly
        ref="chart"
        :data="results"
        :layout="layout"
        :display-mode-bar="true"
      >
      </plotly>
      <!-- Test code -->
      <!-- <v-btn @click="loadResults">Load Results</v-btn> -->
    </v-card-text>
  </v-card>
</template>

<script>
// Have tried ApexCharts: https://apexcharts.com with Vue wrapper. However,
// it has some kind of performance issue most likely because the package is built
// upon svg. It is extremely slow to show 20,000 genes' results.
// Focus on using plotly.js - NB by G.W.
// use vue-plotly wrapper: https://github.com/David-Desmaisons/vue-plotly
// Make sure {} used in the following statement
import { Plotly } from "vue-plotly";

export default {
  name: "VolcanoPlotUtils",
  components: {
    plotly: Plotly,
  },

  data() {
    return {
      dashType: 'dot',
      lineWidth: 1,
      lineColor: "#ffd699",
      showlegend: false,
    }
  },

  computed: {
      results: function() {
        return this.generateResults();
      },
      // Defined as a computed prop so that it can be overriden in the parent component
      layout: function() {
        return {
          showlegend: this.showlegend,
          xaxis: {
            title: "Log" + "2".sub() + "FC",
          },
          yaxis: {
            title: "-Log10(pValue)",
          },
        };
      }
  },

  methods: {

    generateResults() {
      let plotData = this.initData()
      plotData = this.updatePlot(plotData)
      return plotData
    },

    initData() {
        let plotData = [
          this.createData('Selected', '#0000FF'),
          this.createData('Filtered-out', '#D8D8D8'),
        ];
        return plotData
    },

    createData(name, color) {
      return {
               name: name,
                x: [],
                y: [],
                text: [],
                type: "scattergl",
                mode: "markers", // This should be insde
                marker: {
                    size: 3,
                    color: color,
                },
      };
    },

    splitData(diffExpResults, 
              pValueCutoff, 
              adjPValueCutoff,
              logFDLower, 
              logFDUpper,
              chosenData,
              filteredData) {
      const chosenX = [];
      const chosenY = [];
      const chosenText = [];
      const filteredX = [];
      const filteredY = [];
      const filteredText = [];
      for (let i = 0; i < diffExpResults.length; i++) {
        let tmp = diffExpResults[i];
        if (
          tmp.pValue < pValueCutoff &&
          tmp.adjPValue < adjPValueCutoff &&
          (tmp.logFC < logFDLower || tmp.logFC > logFDUpper)
        ) {
          chosenX.push(tmp.logFC);
          chosenY.push(-Math.log10(tmp.pValue));
          chosenText.push(this.createText(tmp));
        } else {
          filteredX.push(tmp.logFC);
          filteredY.push(-Math.log10(tmp.pValue));
          filteredText.push(this.createText(tmp));
        }
      }
      chosenData.x = chosenX;
      chosenData.y = chosenY;
      chosenData.text = chosenText;
      filteredData.x = filteredX;
      filteredData.y = filteredY;
      filteredData.text = filteredText;
    },

    createText(diffExpResult) {
        var text = "<b>Gene: " +
              diffExpResult.gene_name +
              "</b><br>" +
              "Log" + "2".sub() + "FC: " +
              diffExpResult.logFC.toExponential(2) +
              "<br>" +
              "AveExpr: " +
              diffExpResult.AveExpr.toExponential(2) +
              "<br>" +
              "pValue: " +
              diffExpResult.pValue.toExponential(2) +
              "<br>" +
              "adjPValue: " +
              diffExpResult.adjPValue.toExponential(2)  
        return text
    },

    // Do nothing. Just a template.
    updatePlot(data) {
        return data // There is no need. Just make browser happy.
    },
  },
};
</script>