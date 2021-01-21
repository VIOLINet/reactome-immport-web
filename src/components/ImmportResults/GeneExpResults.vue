<template>
  <v-card outlined>
    <v-card-title>Gene Expression Results</v-card-title>
    <v-card-text>
      <ResultsDescriptionPanel
        class="mb-5"
        :formData="formSubmission.formData"
      />
      <v-data-table
        dense
        loading="loadingGeneExpressionResults"
        loading-text="Loading... This may take a minute."
        :headers="geneAnalysisHeaders"
        :items="geneExpressionResults"
        :search="geneExpressionSearch"
        :footer-props="{ 'items-per-page-options': [20, 40, 50, 100] }"
      >
        <template v-slot:body.append>
          <tr>
            <td colspan="1">
              <v-text-field
                label="Search"
                v-model="geneExpressionSearch"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                prefix="Expr ≥"
                v-model="geneExpressionAvgExpr"
                type="number"
                min="0"
                step="1"
              ></v-text-field>
            </td>
            <td colspan="1"></td>
            <td colspan="1">
              <v-text-field
                prefix="pVal ≤"
                v-model="geneExpressionPVal"
                type="number"
                min="0"
                max="1"
                step="0.01"
                hide-details
              ></v-text-field>
            </td>
            <td colspan="2"></td>
            <td colspan="1">
              <v-btn color="primary" @click="analyzeGeneSet">Analyze</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <div
        v-if="
          pathwayEnrichmentResults.pathways &&
          pathwayEnrichmentResults.pathways.length > 0
        "
      >
        <hr />
        <h1 class="text-left ma-3">Pathway Enrichment Analysis</h1>
        <v-data-table
          dense
          :headers="PathwayEnrichmentHeaders"
          :items="
            pathwayEnrichmentResults ? pathwayEnrichmentResults.pathways : []
          "
          :footer-props="{ 'items-per-page-options': [20, 40, 50, 100] }"
        >
          <template v-slot:item.entities.ratio="{ item }">
            <p :title="item.entities.ratio">
              {{ item.entities.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities.pValue="{ item }"
            ><p :title="item.entities.pValue">
              {{ item.entities.pValue.toExponential(2) }}
            </p></template
          >
          <template v-slot:item.entities.fdr="{ item }"
            ><p :title="item.entities.fdr">
              {{ item.entities.fdr.toExponential(2) }}
            </p></template
          >
          <template v-slot:body.append>
            <tr>
              <td colspan="6"></td>
              <td colspan="1">
                <v-text-field
                  prefix="pVal ≤"
                  v-model="pathwayEnrichmentFDR"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  hide-details=""
                  class="mb-3"
                ></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
      <CyInstance
        v-if="fiNetwork && fiNetwork.length > 0"
        :cyElementsProp="fiNetwork"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ImmportService from "../../service/ImmportService";
import CyInstance from "./CyInstance";
import ResultsDescriptionPanel from "./Description/ResultsDescriptionPanel";
export default {
  name: "GeneExpResults",
  components: {
    CyInstance,
    ResultsDescriptionPanel,
  },
  props: {
    formSubmission: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    geneExpressionResults: [],
    geneExpressionSearch: "",
    loadingGeneExpressionResults: false,
    geneExpressionPVal: 1,
    geneExpressionAvgExpr: 0,
    pathwayEnrichmentFDR: 1,
    pValueSelection: 0.05,
    loadingReactomeAnalyses: false,
    reactomeAnalysesLoaded: false,
    pathwayEnrichmentResults: {},
    fiNetwork: [],
  }),
  computed: {
    geneAnalysisHeaders() {
      return [
        { text: "Gene Name", value: "gene_name" },
        {
          text: "Average Expression",
          value: "AveExpr",
          filter: (value) => {
            if (!this.geneExpressionAvgExpr) return true;
            return value >= this.geneExpressionAvgExpr;
          },
        },
        { text: "pVal", value: "pValue" },
        {
          text: "Adjusted pVal",
          value: "adjPValue",
          filter: (value) => {
            if (!this.geneExpressionPVal) return true;
            return value <= this.geneExpressionPVal;
          },
        },
        { text: "logFC", value: "logFC" },
        { text: "t", value: "t" },
        { text: "B", value: "B" },
      ];
    },
    PathwayEnrichmentHeaders() {
      return [
        { text: "StId", value: "stId" },
        { text: "Pathway Name", value: "name" },
        { text: "Entities Found", value: "entities.found" },
        { text: "Entities Total", value: "entities.total" },
        { text: "Entities Ratio", value: "entities.ratio" },
        { text: "Entities pValue", value: "entities.pValue" },
        {
          text: "Entities FDR",
          value: "entities.fdr",
          filter: (value) => {
            if (!this.pathwayEnrichmentFDR) return true;
            return value <= parseFloat(this.pathwayEnrichmentFDR);
          },
        },
      ];
    },
  },
  async created() {
    this.loadingGeneExpressionResults = true;
    try {
      this.geneExpressionResults = await ImmportService.fetchGeneExpressionAnalysis(
        this.formSubmission.analysisData
      );
    } catch (err) {
      console.log(err);
      this.loadingGeneExpressionResults = false;
    }
    this.loadingGeneExpressionResults = false;
  },
  methods: {
    async analyzeGeneSet() {
      this.loadingReactomeAnalyses = true;
      const genes = this.geneExpressionResults
        .filter(
          (gene) =>
            gene.adjPValue <= this.pValueSelection &&
            gene.AveExpr >= this.geneExpressionAvgExpr
        )
        .map((gene) => gene.gene_name);
      try {
        this.pathwayEnrichmentResults = await ImmportService.fetchPathwayEnrichmentAnalysis(
          genes
        );
        this.fiNetwork = await ImmportService.fetchFINetwork(genes);
      } catch (err) {
        console.log(err);
        this.loadingReactomeAnalyses = false;
      }
      this.loadingReactomeAnalyses = false;
      this.reactomeAnalysesLoaded = true;
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