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
          :footer-props="{ 'items-per-page-options': [20, 40, 50, 100] }"
        >
          <template v-slot:item.AveExpr="{item}">
            <p :title="item.AveExpr">
              {{item.AveExpr.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.logFC="{item}">
            <p :title="item.logFC">
              {{item.logFC.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.pValue="{item}">
            <p :title="item.pValue">
              {{item.pValue.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.adjPValue="{item}">
            <p :title="item.adjPValue">
              {{item.adjPValue.toExponential(2)}}
            </p>
          </template>
          <template v-slot:body.append>
            <tr>
              <td colspan="1">
                <v-text-field
                  label="Search"
                  v-model="geneExpressionSearch"
                  hide-details
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  prefix="≥"
                  v-model="averageGeneExpressionInput"
                  type="number"
                  min="0"
                  step="1"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="1"><v-text-field
                  prefix="abs(logFC)≥"
                  v-model="absLogFCInput"
                  type="number"
                  min="0"
                  step="0.01"
                  hide-details
                ></v-text-field></td>
              <td colspan="1">
                
              </td>
              <td>
                <v-text-field
                  prefix="≤"
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
import _isEqual from "lodash/isEqual";
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
    absLogFCInput: 0,
    filteredPathwayGenes: [],
    filteredFINetworkGenes: []
  }),
  computed: {
    geneAnalysisHeaders() {
      return [
        { text: "Gene Name", value: "gene_name",
        filter: (value) => {
          if(!this.geneExpressionSearch) return true;
          return value.includes(this.geneExpressionSearch)
        } },
        {
          text: "Average Expression",
          value: "AveExpr",
          filter: (value) => {
            if (!this.averageGeneExpressionInput) return true;
            return value >= this.averageGeneExpressionInput;
          },
        },
        {
          text: "logFC",
          value: "logFC",
          filter: (value) => {
            if (!this.absLogFCInput) return true;
            return Math.abs(value) >= this.absLogFCInput;
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
      ];
    },
    filteredGenes() {
      return this.geneExpressionResults.filter(
        (result) =>
          result.adjPValue <= this.adjustedPValInput &&
          result.AveExpr >= this.averageGeneExpressionInput &&
          Math.abs(result.logFC) >= this.absLogFCInput
      );
    },
  },
  methods: {
    pathwayEnrichmentButtonClicked() {
      if(_isEqual(this.filteredPathwayGenes, this.filteredGenes)) return;
      this.filteredPathwayGenes = this.filteredGenes;
      this.$emit("doPathwayEnrichmentAnalysis", this.filteredPathwayGenes);
      this.show = false;
    },
    fiNetowrkButtonClicked() {
      if(_isEqual(this.filteredFINetworkGenes, this.filteredGenes))return;
      this.filteredFINetworkGenes = this.filteredGenes;
      this.$emit("doFINetworkAnalysis", this.filteredFINetworkGenes.slice(0,450));
      this.show = false;
    },
  },
};
</script>

<style scoped>
</style>