<script>
import PathwayResultsPlot from "./PathwayResultsPlot.vue";

export default {
  name: "ComparisonPathwayPlot",
  mixins: [PathwayResultsPlot],
  
  props: {
    pathwayEnrichmentResults1: {
      type: Array,
      default: () => [],
    },
    title1: {
        type: String,
        default: 'Result 1',
    },
    pathwayEnrichmentResults2: {
      type: Array,
      default: () => [],
    },
    title2: {
        type: String,
        default: 'Result 2',
    }
  },

  data() {
      return {
          showlegend: true,
      }
  },

  methods: {

    generateLocalPathwayList() {
      let list1 = this._generateLocalPathwayList(this.pathwayEnrichmentResults1);
      let list2 = this._generateLocalPathwayList(this.pathwayEnrichmentResults2);
      // Need to merge these two pathways together
      let set = new Set();
      for (let pathway of list1) set.add(pathway.name);
      for (let pathway of list2) {
        if (!set.has(pathway.name)) list1.add(pathway);
      }
      list1.sort((p1, p2) => p1.name.localeCompare(p2.name));
      return list1;
    },
    
    generateResults() {
      let data1 = this.generateTypedResults(this.pathwayEnrichmentResults1, 'a');
      let data2 = this.generateTypedResults(this.pathwayEnrichmentResults2, 'b');
      let plotData = data1.concat(data2);
      // Sort based on combined names, which put the same top pathways together
      // for easy on or off.
      plotData.sort((p1, p2) => p1.name.localeCompare(p2.name));
      return plotData;
    },
  },
};
</script>
