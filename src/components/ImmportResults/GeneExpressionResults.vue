<template>
  <v-card outlined>
    <v-card-title>
      <h4>Gene Expression Analysis</h4>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="ma-1"
        @click="pathwayEnrichmentButtonClicked"
        >Pathway Analysis</v-btn
      >
      <v-btn color="primary" class="ma-1" @click="fiNetowrkButtonClicked"
        >Network Analysis</v-btn
      >
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <v-data-table
          dense
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
                  v-model="averageGeneExpressionInput"
                  type="number"
                  min="0"
                  step="1"
                ></v-text-field>
              </td>
              <td colspan="1"></td>
              <td colspan="1">
                <v-text-field
                  prefix="pVal ≤"
                  v-model="adjustedPValInput"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  hide-details
                ></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "GeneExpressionResults",
  props: {
    geneExpressionResults: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    show: true,
    averageGeneExpressionInput: 0,
    adjustedPValInput: 1,
    geneExpressionSearch: "",
  }),
  computed: {
    geneAnalysisHeaders() {
      return [
        { text: "Gene Name", value: "gene_name" },
        {
          text: "Average Expression",
          value: "AveExpr",
          filter: (value) => {
            if (!this.averageGeneExpressionInput) return true;
            return value >= this.averageGeneExpressionInput;
          },
        },
        { text: "pVal", value: "pValue" },
        {
          text: "Adjusted pVal",
          value: "adjPValue",
          filter: (value) => {
            if (!this.adjustedPValInput) return true;
            return value <= this.adjustedPValInput;
          },
        },
        { text: "logFC", value: "logFC" },
        { text: "t", value: "t" },
        { text: "B", value: "B" },
      ];
    },
    filteredGenes() {
      return this.geneExpressionResults.filter(
        (result) =>
          result.adjPValue <= this.adjustedPValInput &&
          result.AveExpr >= this.averageGeneExpressionInput
      );
    },
  },
  methods: {
    pathwayEnrichmentButtonClicked() {
      this.$emit("doPathwayEnrichmentAnalysis", this.filteredGenes);
      this.show = false;
    },
    fiNetowrkButtonClicked() {
      this.$emit("doFINetworkAnalysis", this.filteredGenes);
      this.show = false;
    },
  },
};
</script>

<style scoped>
</style>