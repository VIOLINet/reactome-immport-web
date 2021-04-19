<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div>
        <div>
          <p class="mb-0">{{compareFrom.formData.resultSetName}} & {{compareTo.formData.resultSetName}}</p>
        </div>
      </div>
      <div>
        <div>
          <v-btn icon @click="show = !show">
            <v-icon>{{show ? "mdi-chevron-up" : "mdi-chevron-down"}}</v-icon>
          </v-btn>
        <v-btn icon @click="closeComparison"
          ><v-icon>{{ "mdi-close" }}</v-icon></v-btn
        >
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <DescriptionComparisonPanel
        class="mb-5"
        :formDatas="[compareFrom.formData, compareTo.formData]"
        :compareFrom="{
          displayId: compareFrom.displayId,
          ...compareFrom.formData,
        }"
        :compareTo="{
          displayId: compareTo.displayId,
          ...compareTo.formData,
        }"
      />
      <GeneExpressionComparison
        :geneExpressionOne="compareFrom.geneExpressionResults"
        :geneExpressionTwo="compareTo.geneExpressionResults"
      />
      <PathwayEnrichmentComparison
        class="mt-5"
        v-if="
          compareFrom.enrichmentResults.pathways ||
          compareTo.enrichmentResults.pathways
        "
        :pathwayEnrichmentOne="compareFrom.enrichmentResults"
        :pathwayEnrichmentTwo="compareTo.enrichmentResults"
      />
      <CyInstance
        v-if="fiNetwork.length > 0"
        class="mt-5"
        :cyElementsProp="fiNetwork"
        :comparisonSet="true"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DescriptionComparisonPanel from "./DescriptionComparisonPanel";
import GeneExpressionComparison from "./GeneExpressionComparison";
import PathwayEnrichmentComparison from "./PathwayEnrichmentComparison";
import CyInstance from "../Cytoscape/CyInstance";
export default {
  name: "CompareResultsPanel",
  components: {
    DescriptionComparisonPanel,
    GeneExpressionComparison,
    PathwayEnrichmentComparison,
    CyInstance,
  },
  props: {
    compareFrom: {
      type: Object,
      default: () => {},
    },
    compareTo: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    show: true,
  }),
  computed: {
    fiNetwork() {
      const rtn = [];
      const network1 = JSON.parse(JSON.stringify(this.compareFrom.fiNetwork.network)); //network1 won't be mutated
      var network2 = JSON.parse(JSON.stringify(this.compareTo.fiNetwork.network)); //network2 will be mutated by network1's loop

      network1.forEach((obj) => {
        //if group is node, filter out any same node from network2
        if (obj.group === "nodes") {
          if (network2.some((item) => item.data.id === obj.data.id)) {
            network2 = network2.filter((item) => item.data.id !== obj.data.id);
            obj.data.nodeColor = getComputedStyle(document.documentElement).getPropertyValue('--node-a-b-color');
          }else
            obj.data.nodeColor = getComputedStyle(document.documentElement).getPropertyValue('--node-a-color');
          rtn.push(obj);
        }
        //if group is edge, check if exists in network2
        else if (obj.group === "edges") {
          if (network2.some((item) => item.data.id === obj.data.id)) {
            network2 = network2.filter((item) => item.data.id !== obj.data.id);
            obj.data.lineColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-a-b-color');
          } else {
            obj.data.lineColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-a-color');
          }
          rtn.push(obj);
        }
      });

      //if network2 is empty, just return rtn as is after looping over network1
      if (!network2 || network2.length === 0) return rtn;

      //compareFrom.fiNetwork should have filtred out all of network2 that we dont want
      //loop over network2 and add all nodes. if edge, set color to blue.
      network2.forEach((obj) => {
        if (obj.group === "edges") {
          obj.data.lineColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-b-color');
          rtn.push(obj);
        } else if (obj.group === "nodes") {
          obj.data.nodeColor = getComputedStyle(document.documentElement).getPropertyValue('--node-b-color');
          rtn.push(obj);
        }
      });

      return rtn;
    },
  },
  methods: {
    closeComparison() {
      this.$emit("closeComparison", [this.compareFrom.id, this.compareTo.id]);
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
</style>