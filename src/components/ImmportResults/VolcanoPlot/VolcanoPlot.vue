<script>
// Used for single analysis display
import VolcanoPlotUtils from "./VolcanoPlotUtils"
import ImmportService from '../../../service/ImmportService';

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
      return data
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