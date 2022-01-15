<script>
// Used for single analysis display
import VolcanoPlotUtils from "./VolcanoPlotUtils";
import ImmportService from "../../../service/ImmportService";

export default {
  name: "ScatterPlot",
  mixins: [VolcanoPlotUtils],

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

  computed: {
    // May try to use a watched prop to reset these layout parameters
    // which may be more efficient.
    layout: function () {
      return {
        showlegend: false,
        xaxis: {
          title: "Log" + "2".sub() + "FC",
          range: this.xrange,
        },
        yaxis: {
          title: "-Log10(pValue)",
          range: this.yrange,
        },
        shapes: [
          {
            type: "line",
            x0: this.logFDLower,
            y0: 0,
            x1: this.logFDLower,
            y1: this.yrange[1] + this.offset,
            line: {
              color: this.lineColor,
              width: this.lineWidth,
              dash: this.dashType,
            },
          },
          {
            type: "line",
            x0: this.logFDUpper,
            y0: 0,
            x1: this.logFDUpper,
            y1: this.yrange[1] + this.offset,
            line: {
              color: this.lineColor,
              width: this.lineWidth,
              dash: this.dashType,
            },
          },
          {
            type: "line",
            x0: this.xrange[0] - this.offset,
            y0: -Math.log10(this.pValueCutoff),
            x1: this.xrange[1] + this.offset,
            y1: -Math.log10(this.pValueCutoff),
            line: {
              color: this.lineColor,
              width: this.lineWidth,
              dash: this.dashType,
            },
          },
        ],
      };
    },

    xrange: function() {
      const diffExpResults = this.geneExpressionResults;
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      for (let i = 0; i < diffExpResults.length; i++) {
        let tmp = diffExpResults[i];
        if (tmp.logFC < min) 
          min = tmp.logFC;
        else if (tmp.logFC > max)
          max = tmp.logFC;
      }
      return [min - this.offset, max + this.offset]
    },

    yrange: function() {
      const diffExpResults = this.geneExpressionResults;
      let max = Number.MIN_VALUE;
      for (let i = 0; i < diffExpResults.length; i++) {
        let tmp = diffExpResults[i];
        tmp = -Math.log10(tmp.pValue)
        if (tmp > max) max = tmp;
      }
      return [0, max + this.offset]
    },
  },

  methods: {

    getYAxisRange() {
      let chart = this.$refs.chart;
      let yaxis = chart.layout.yaxis;
      console.info(yaxis.range);
      return yaxis.range;
    },

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
          chosenText.push(this.createText(tmp));
        } else {
          filteredX.push(tmp.logFC);
          filteredY.push(-Math.log10(tmp.pValue));
          filteredText.push(this.createText(tmp));
        }
      }
      data[0].x = chosenX;
      data[0].y = chosenY;
      data[0].text = chosenText;
      data[1].x = filteredX;
      data[1].y = filteredY;
      data[1].text = filteredText;
      return data;
    },

    async loadResults() {
      // Test code
      try {
        this.geneExpressionResults =
          await ImmportService.fetchTestGeneExpressionAnalysis();
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