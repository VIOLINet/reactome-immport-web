<template>
  <v-card outlined>
    <v-card-text>
      <plotly
        ref="chart"
        :data="data"
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
import ImmportService from '../../../service/ImmportService';

export default {
  name: "ScatterPlot",
  components: {
    plotly: Plotly,
  },
  props: {
    geneExpressionResults: {
      type: Array,
      default: () => [],
    },
    logFDLower: {
      type: Number,
      default: -0.2,
    },
    logFDUpper: {
      type: Number,
      default: 0.2,
    },
    pValueCutoff: {
      type: Number,
      default: 0.05,
    },
    adjPValueCutoff: {
      type: Number,
      default: 1.0, // No filter for FDR
    },
  },
  data: () => ({
    layout: {
      showlegend: false,
      xaxis: {
        title: "LogFD",
      },
      yaxis: {
        title: "-Log10(pValue)",
      },
    },
  }),
  computed: {
      data: function() {
            var plotData = [
            {
                name: "Selected",
                x: [1, 2, 3, 4],
                y: [10, 15, 13, 17],
                text: ["p1", "p2", "p3", "p4"],
                type: "scatter",
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
                type: "scatter",
                mode: "markers", // This should be insde
                marker: {
                    size: 3,
                    color: "#D8D8D8",
                }
            }
            ]
            this.updatePlot(plotData)
            return plotData
      }
  },
  methods: {
    updatePlot(data) {
      const diffExpResults = this.geneExpressionResults;
      const chosenX = [];
      const chosenY = [];
      const chosenText = [];
      const filteredX = [];
      const filteredY = [];
      const filteredText = [];
      for (let i = 0; i < diffExpResults.length; i++) {
        let tmp = diffExpResults[i];
        if (
          tmp.pValue < this.pValueCutoff &&
          tmp.adjPValue < this.adjPValueCutoff &&
          (tmp.logFC < this.logFDLower || tmp.logFC > this.logFDUpper)
        ) {
          chosenX.push(tmp.logFC);
          chosenY.push(-Math.log10(tmp.pValue));
          chosenText.push(
            "<b>Gene: " +
              diffExpResults[i].gene_name +
              "</b><br>" +
              "logFC: " +
              diffExpResults[i].logFC.toExponential(2) +
              "<br>" +
              "AveExpr: " +
              diffExpResults[i].AveExpr.toExponential(2) +
              "<br>" +
              "pValue: " +
              diffExpResults[i].pValue.toExponential(2) +
              "<br>" +
              "adjPValue: " +
              diffExpResults[i].adjPValue.toExponential(2)
          );
        } else {
          filteredX.push(tmp.logFC);
          filteredY.push(-Math.log10(tmp.pValue));
          filteredText.push(
            "<b>Gene: " +
              diffExpResults[i].gene_name +
              "</b><br>" +
              "logFC: " +
              diffExpResults[i].logFC.toExponential(2) +
              "<br>" +
              "AveExpr: " +
              diffExpResults[i].AveExpr.toExponential(2) +
              "<br>" +
              "pValue: " +
              diffExpResults[i].pValue.toExponential(2) +
              "<br>" +
              "adjPValue: " +
              diffExpResults[i].adjPValue.toExponential(2)
          );
        }
      }
      data[0].x = chosenX;
      data[0].y = chosenY;
      data[0].text = chosenText;
      data[1].x = filteredX;
      data[1].y = filteredY;
      data[1].text = filteredText;
    },

    async loadResults() {
      // Test code
      try {
        this.geneExpressionResults = await ImmportService.fetchTestGeneExpressionAnalysis()
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.resetButton {
  width: 8px;
}
</style>