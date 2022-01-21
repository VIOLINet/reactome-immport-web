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
        },
        yaxis: {
          title: "-Log10(pValue)",
        },
        shapes: [
          {
            type: "line",
            yref: "paper",
            x0: this.logFDLower,
            y0: 0,
            x1: this.logFDLower,
            y1: 1,
            line: {
              color: this.lineColor,
              width: this.lineWidth,
              dash: this.dashType,
            },
          },
          {
            type: "line",
            yref: "paper",
            x0: this.logFDUpper,
            y0: 0,
            x1: this.logFDUpper,
            y1: 1,
            line: {
              color: this.lineColor,
              width: this.lineWidth,
              dash: this.dashType,
            },
          },
          {
            type: "line",
            xref: 'paper',
            x0: 0,
            y0: -Math.log10(this.pValueCutoff),
            x1: 1,
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
  },

  methods: {

    getYAxisRange() {
      let chart = this.$refs.chart;
      let yaxis = chart.layout.yaxis;
      console.info(yaxis.range);
      return yaxis.range;
    },

    updatePlot(data) {
      this.splitData(this.geneExpressionResults,
                     this.pValueCutoff,
                     this.adjPValueCutoff,
                     this.logFDLower,
                     this.logFDUpper,
                     data[0],
                     data[1]);
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