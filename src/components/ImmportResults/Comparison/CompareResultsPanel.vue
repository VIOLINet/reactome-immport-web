<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div>
        <p class="mb-0">
          Comparing Results {{ compareFrom.displayId }} &
          {{ compareTo.displayId }}
        </p>
      </div>
      <div>
        <v-btn icon @click="closeComparison"
          ><v-icon>{{ "mdi-close" }}</v-icon></v-btn
        >
      </div>
    </v-card-title>
    <v-card-text>
      <DescriptionComparisonPanel
        class="mb-5"
        :formDatas="[compareFrom.formData, compareTo.formData]"
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
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DescriptionComparisonPanel from "./DescriptionComparisonPanel";
import GeneExpressionComparison from "./GeneExpressionComparison";
import PathwayEnrichmentComparison from "./PathwayEnrichmentComparison";
import CyInstance from "../CyInstance";
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
  computed: {
    fiNetwork() {
      const rtn = [];
      const network1 = [...this.compareFrom.fiNetwork]; //network1 won't be mutated
      var network2 = [...this.compareTo.fiNetwork]; //network2 will be mutated by network1's loop

      network1.forEach((obj) => {
        //if group is node, filter out any same node from network2
        if (obj.group === "nodes") {
          network2 = network2.filter((item) => item.data.id !== obj.data.id);
          rtn.push(obj);
        }
        //if group is edge, check if exists in network2. If it does, remove and set background color to purple
        //if doesn't exist in network2, set background color to red
        else if (obj.group === "edges") {
          if (network2.some((item) => item.data.id === obj.data.id)) {
            network2 = network2.filter((item) => item.data.id !== obj.data.id);
            obj.data.lineColor = "#F00";
          } else {
            obj.data.lineColor = "#FFA500";
          }
          rtn.push(obj);
        }
      });

      //if network2 is empty, just return rtn as is after looping over network1
      if (!network2 || network2.length === 0) return rtn;

      //compareFrom.fiNetwork should have filtred out all of network2 that we dont want
      //loop over network2 and add all nodes. if edge, set color to blue.
      network2.forEach((obj) => {
        //only need to mutate obj if it is an edge. otherwise just push as is
        if (obj.group === "edges") {
          obj.data.lineColor = "#800080";
        }
        rtn.push(obj);
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