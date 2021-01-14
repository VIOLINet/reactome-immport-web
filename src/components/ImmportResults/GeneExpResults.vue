<template>
  <v-card outlined>
    <v-card-title>Gene Expression Results</v-card-title>
    <v-card-text>
      <v-tabs center-active show-arrows centered>
        <v-tab>Gene Expression Analysis</v-tab>
        <v-tab-item>
          <v-data-table
            dense
            :headers="geneAnalysisHeaders"
            :items="reactomeAnalyses.geneExpressionResults"
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
                <td colspan="1"></td>
                <td colspan="1">
                  <v-text-field
                    prefix="pVal ≤"
                    v-model="geneExpressionPVal"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    hide-details=""
                  ></v-text-field>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab>Reactome Pathway Enrichment</v-tab>
        <v-tab-item>
          <v-data-table
            dense
            :headers="PathwayEnrichmentHeaders"
            :items="
              reactomeAnalyses.pathwayEnrichmentResults
                ? reactomeAnalyses.pathwayEnrichmentResults.pathways
                : []
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
        </v-tab-item>
        <v-tab>Functional Interactions</v-tab>
        <v-tab-item>
          <CyInstance :cyElementsProp="reactomeAnalyses.fiNetwork" />
        </v-tab-item>
        <v-tab>Description</v-tab>
        <v-tab-item>
          <v-row>
            <v-col cols="12" md="6">
              <ResultsDescription :formData="reactomeAnalyses.formData" />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import CyInstance from "./CyInstance";
import ResultsDescription from "./ResultsDescription";
export default {
  name: "GeneExpResults",
  components: {
    CyInstance,
    ResultsDescription,
  },
  props: {
    reactomeAnalyses: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    geneExpressionPVal: 1,
    pathwayEnrichmentFDR: 1,
    geneExpressionSearch: "",
  }),
  computed: {
    geneAnalysisHeaders() {
      return [
        { text: "Gene Name", value: "gene_name" },
        { text: "Average Expression", value: "AveExpr" },
        {
          text: "pVal",
          value: "P.Value",
          filter: (value) => {
            if (!this.geneExpressionPVal) return true;
            return value <= this.geneExpressionPVal;
          },
        },
        { text: "Adjusted pVal", value: "adj.P.Val" },
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
};
</script>

<style scoped>
td {
  outline: none;
  border: none;
}
</style>