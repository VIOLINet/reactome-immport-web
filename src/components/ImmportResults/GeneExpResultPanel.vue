<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div>
        <p class="mb-0">Gene Set Analysis {{resultSet.displayId}}</p>
        <p class="small">{{resultSet.formData.selectedVaccines.join(", ")}}</p>
        </div>
      <div>
        <v-btn color="primary" class="ma-1" @click="$emit('compareResults', resultSet.id)">Compare Results</v-btn>
        <v-btn icon @click="closeResults"
          ><v-icon>{{ "mdi-close" }}</v-icon></v-btn
        >
      </div>
    </v-card-title>
    <v-card-text>
      <ResultsDescriptionPanel class="mb-5" :formData="resultSet.formData" />
      <GeneExpressionResults
        :geneExpressionResults="resultSet.geneExpressionResults"
        @doPathwayEnrichmentAnalysis="fetchPathwayEnrichmentAnalysis"
        @doFINetworkAnalysis="fetchNetworkAnalysis"
      />
      <PathwayEnrichmentResults
        class="mt-5"
        v-if="resultSet.enrichmentResults.pathways"
        :pathwayEnrichmentResults="resultSet.enrichmentResults"
      />
      <CyInstance
      class="mt-5"
        v-if="resultSet.fiNetwork.length > 0"
        :cyElementsProp="resultSet.fiNetwork"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import CyInstance from "./CyInstance";
import ResultsDescriptionPanel from "./Description/ResultsDescriptionPanel";
import GeneExpressionResults from "./GeneExpressionResults";
import PathwayEnrichmentResults from "./PathwayEnrichmentResults";
export default {
  name: "GeneExpResults",
  components: {
    CyInstance,
    ResultsDescriptionPanel,
    GeneExpressionResults,
    PathwayEnrichmentResults,
  },
  props: {
    resultSet: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({}),
  computed: {
    showEnrichmentResults() {
      const obj = this.resultSet.enrichmentResults;
      return obj && obj.pathways ? true : false;
    },
  },
  methods: {
    fetchPathwayEnrichmentAnalysis(genes) {
      this.$emit("fetchPathwayEnrichmentAnalysis", this.resultSet.id, genes);
    },
    async fetchNetworkAnalysis(genes) {
      this.$emit("fetchNetworkAnalysis", this.resultSet.id, genes);
    },
    closeResults() {
      this.$emit("closeResults", this.resultSet.id);
    },
  },
};
</script>

<style scoped>
td {
  outline: none;
  border: none;
}
.flex {
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 8px 16px;
}
.small{
  text-align: left;
  font-size: small;
}
</style>