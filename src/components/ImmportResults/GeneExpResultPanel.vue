<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div>
        <div v-if="!editText">
          <span class="mb-0">{{panelTitle}}</span>
          <button icon @click="editText = true">
            <v-icon small>{{ "mdi-pencil-outline" }}</v-icon>
          </button>
        </div>
        <div v-if="editText">
          <v-text-field
            v-model="editTextInput"
            :placeholder="defaultPanelTitle"
            hide-details="true"
            @keyup.enter="updateTitleText"
          ></v-text-field>
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
          v-if="resultSet.enrichmentResults.pathways"
          :pathwayEnrichmentResults="resultSet.enrichmentResults"
        />
        <CyInstance
          class="mt-5"
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
    panelTitle: "",
    editText: false,
    editTextInput: "",
  }),
  created() {
    this.updateTitleText();
  },
  computed: {
    showEnrichmentResults() {
      const obj = this.resultSet.enrichmentResults;
      return obj && obj.pathways ? true : false;
    },
    defaultPanelTitle() {
      return "Gene Set Analysis " + this.resultSet.displayId;
    }
  },
  methods: {
    fetchPathwayEnrichmentAnalysis(genes) {
      this.$emit("fetchPathwayEnrichmentAnalysis", this.resultSet.id, genes);
    },
    async fetchNetworkAnalysis(genes) {
      this.$emit("fetchNetworkAnalysis", this.resultSet.id, genes);
    },
    updateTitleText(){
      if(this.editTextInput === "")
        this.panelTitle = this.defaultPanelTitle
      else{
        this.panelTitle = this.editTextInput;
        this.editTextInput = ""
      }
      this.editText = false;
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