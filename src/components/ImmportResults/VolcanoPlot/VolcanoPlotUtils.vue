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
      offset: 0.05,
      dashType: 'dot',
      lineWidth: 1,
      lineColor: "#ffd699",
    }
  },

  computed: {
      results: function() {
            var plotData = this.initData()
            plotData = this.updatePlot(plotData)
            return plotData
      },
      // Defined as a computed prop so that it can be overriden in the parent component
      layout: function() {
        return {
          showlegend: false,
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
    initData() {
        var plotData = [
            {
                name: "Selected",
                x: [1, 2, 3, 4],
                y: [10, 15, 13, 17],
                text: ["p1", "p2", "p3", "p4"],
                type: "scattergl", // Make sure scattergl is used to use webgl for performance
                mode: "markers", // This should be insde
                marker: {
                    size: 3,
                    color: "#0000FF",
                }
            },
            {
                name: "Filtered-out",
                x: [],
                y: [],
                text: [],
                type: "scattergl",
                mode: "markers", // This should be insde
                marker: {
                    size: 3,
                    color: "#D8D8D8",
                }
            }
        ];
        return plotData
    },

    createText(diffExpResult) {
        var text = "<b>Gene: " +
              diffExpResult.gene_name +
              "</b><br>" +
              "logFC: " +
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