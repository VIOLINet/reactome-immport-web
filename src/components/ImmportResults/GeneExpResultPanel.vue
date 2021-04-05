<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div>
        <div>
          <p class="mb-0">{{ resultSet.formData.resultSetName }}</p>
        </div>
        <p class="small">
          {{ resultSet.formData.selectedVaccines.join(", ") }}
        </p>
      </div>
      <div>
        <v-btn
          color="primary"
          class="ma-1"
          @click="$emit('compareResults', resultSet.id)"
          >Compare Results</v-btn
        >
        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
        <v-btn icon @click="closeResults"
          ><v-icon>{{ "mdi-close" }}</v-icon></v-btn
        >
      </div>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <ResultsDescriptionPanel class="mb-5" :formData="resultSet.formData" />
        <GeneExpressionResults
          :geneExpressionResults="resultSet.geneExpressionResults"
          @doPathwayEnrichmentAnalysis="fetchPathwayEnrichmentAnalysis"
          @doFINetworkAnalysis="fetchNetworkAnalysis"
        />
        <PathwayEnrichmentResults
          class="mt-5"
          :id="resultSet.id + 'pathwayEnrichment'"
          v-if="resultSet.enrichmentResults.pathways"
          :pathwayEnrichmentResults="resultSet.enrichmentResults"
        />
        <CyInstance
          class="mt-5"
          :id="resultSet.id + 'fiNetwork'"
          v-if="resultSet.fiNetwork.length > 0"
          :cyElementsProp="resultSet.fiNetwork"
        />
      </v-card-text>
    </v-expand-transition>
    <slot :name="resultSet.id"></slot>
  </v-card>
</template>

<script>
import CyInstance from "./Cytoscape/CyInstance";
import ResultsDescriptionPanel from "./Description/ResultsDescriptionPanel";
import GeneExpressionResults from "./GeneExpressionResults";
import PathwayEnrichmentResults from "./PathwayEnrichmentResults";
import _isEqual from "lodash/isEqual";
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
  data: () => ({
    show: true,
  }),
  watch: {
    "resultSet.enrichmentResults": {
      handler(newVal, oldVal) {
        newVal.pathways && (!oldVal || !_isEqual(newVal, oldVal)) &&
          setTimeout(() => {
            document.getElementById(this.resultSet.id + "pathwayEnrichment").scrollIntoView();
          }, 250);
      },
      deep: true,
    },
    "resultSet.fiNetwork": {
      handler(newVal, oldVal) {
        newVal && (!oldVal || !_isEqual(newVal, oldVal)) &&
        setTimeout(() => {
          document.getElementById(this.resultSet.id + "fiNetwork").scrollIntoView()
        }, 250)
      }
    },
    editTextInput(val) {
      if(val.length > 10) 
        this.editTextInput = this.editTextInput.slice(0, -1)
    }
  },
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
.small {
  text-align: left;
  font-size: small;
}
</style>