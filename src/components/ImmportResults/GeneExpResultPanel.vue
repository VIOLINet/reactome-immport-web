<template>
  <v-card outlined>
    <v-card-title>Gene Expression Results</v-card-title>
    <v-card-text>
      <ResultsDescriptionPanel
        class="mb-5"
        :formData="formSubmission.formData"
      />
      <GeneExpressionResults
        v-if="
          this.geneExpressionResults && this.geneExpressionResults.length > 0
        "
        class="mb-5"
        :geneExpressionResults="geneExpressionResults"
        @doPathwayEnrichmentAnalysis="fetchPathwayEnrichmentAnalysis"
        @doFINetworkAnalysis="fetchNetworkAnalysis"
      />
      <PathwayEnrichmentResults
        v-if="
          this.pathwayEnrichmentResults.pathways &&
          this.pathwayEnrichmentResults.pathways.length > 0
        "
        class="mb-5"
        :pathwayEnrichmentResults="pathwayEnrichmentResults"
      />
      <CyInstance
        v-if="fiNetwork && fiNetwork.length > 0"
        class="mb-5"
        :cyElementsProp="fiNetwork"
      />
      <v-card outlined v-if="loadingReactomeAnalyses">
        <v-card-text>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import ImmportService from "../../service/ImmportService";
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
    formSubmission: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    pathwayEnrichmentFDR: 1,
    pValueSelection: 0.05,
    loadingReactomeAnalyses: false,
    geneExpressionResults: [],
    pathwayEnrichmentResults: {},
    fiNetwork: [],
  }),
  computed: {},
  async created() {
    this.loadingReactomeAnalyses = true;

    try {
      this.geneExpressionResults = await ImmportService.fetchGeneExpressionAnalysis(
        this.formSubmission.analysisData
      );
    } catch (err) {
      console.log(err);
      this.loadingReactomeAnalyses = false;
    }
    this.loadingReactomeAnalyses = false;
  },
  methods: {
    async fetchPathwayEnrichmentAnalysis(genes) {
      this.loadingReactomeAnalyses = true;
      try {
        this.pathwayEnrichmentResults = await ImmportService.fetchPathwayEnrichmentAnalysis(
          genes.map((gene) => gene.gene_name)
        );
      } catch (err) {
        console.log(err);
        this.loadingReactomeAnalyses = false;
      }
      this.loadingReactomeAnalyses = false;
    },
    async fetchNetworkAnalysis(genes) {
      this.loadingReactomeAnalyses = true;
      try {
        this.fiNetwork = await ImmportService.fetchFINetwork(
          genes.map((gene) => gene.gene_name)
        );
      } catch (err) {
        console.log(err);
        this.loadingReactomeAnalyses = false;
      }
      this.loadingReactomeAnalyses = false;
    },
  },
};
</script>

<style scoped>
td {
  outline: none;
  border: none;
}
</style>