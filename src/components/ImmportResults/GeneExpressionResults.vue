<template>
  <v-card outlined>
    <v-card-title>
      <h4>Gene Expression Analysis</h4>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="ma-1" @click="loadTestData">
        Load Test Data
      </v-btn>
      <v-btn
        color="primary"
        class="ma-1"
        @click="pathwayEnrichmentButtonClicked"
        >Pathway Analysis</v-btn
      >
      <v-btn color="primary" class="ma-1" @click="fiNetowrkButtonClicked">
        Network Analysis
      </v-btn>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <plot :geneExpressionResults="geneExpressionResults"
              :logFDLower="logFCLowerBoundInput"
              :logFDUpper="logFCUpperBoundInput"
              :pValueCutoff="pValInput"
              :adjPValueCutoff="adjustedPValInput">
        </plot>
        <v-card outlined>
        <v-data-table
          dense
          @input="alert('Table updated')"
          :headers="geneAnalysisHeaders"
          :items="geneExpressionResults"
          :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
          no-results-text="No genes. Try less strict filter thresholds."
        >
          <template
            v-for="(h, index) in geneAnalysisHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <span :key="index" v-html="header.text"></span>
          </template>
          <template v-slot:item.AveExpr="{ item }">
            <p :title="item.AveExpr">
              {{ item && item.AveExpr && item.AveExpr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.logFC="{ item }">
            <p :title="item.logFC">
              {{ item && item.logFC && item.logFC.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.pValue="{ item }">
            <p :title="item.pValue">
              {{ item && item.pValue && item.pValue.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.adjPValue="{ item }">
            <p :title="item.adjPValue">
              {{ item && item.adjPValue && item.adjPValue.toExponential(2) }}
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
              <td colspan="1"></td>
              <td colspan="1" class="flex" style="height: 100%; padding: 5px">
                <v-text-field
                  v-model="logFCLowerBoundInput"
                  type="number"
                  prefix="logFC <"
                  min="-0"
                  step="-0.01"
                  hide-details
                  style="width: 50px"
                ></v-text-field>
                <h4 class="union">or</h4>
                <v-text-field
                  v-model="logFCUpperBoundInput"
                  prefix="logFC > "
                  type="number"
                  min="0"
                  step="0.01"
                  hide-details
                  style="width: 50px"
                ></v-text-field>
              </td>
              <td colspan="1">
                <v-text-field
                  prefix="≤"
                  v-model="pValInput"
                  type="number"
                  min="0"
                  step="0.01"
                  hide-details
                ></v-text-field>
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
        </v-card>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
import _isEqual from "lodash/isEqual";
import ScatterPlot from "./VolcanoPlot/VolcanoPlot"
import ImmportService from '../../service/ImmportService';

export default {
  name: "GeneExpressionResults",
  components: {
    plot: ScatterPlot
  },
  props: {
    geneExpressionResults: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    show: true,
    pValInput: 0.05,
    adjustedPValInput: 1,
    geneExpressionSearch: "",
    logFCLowerBoundInput: -0.2, // around 1.15 fold change
    logFCUpperBoundInput: 0.2,
    filteredPathwayGenes: [],
    filteredFINetworkGenes: [],
  }),
  computed: {
    geneAnalysisHeaders() {
      return [
        {
          text: "Gene Name",
          value: "gene_name",
          filter: (value) => {
            if (!this.geneExpressionSearch) return true;
            return value.includes(this.geneExpressionSearch);
          },
        },
        {
          text: "Average Expression",
          value: "AveExpr",
        },
        {
          text: "Log" + "2".sub() + "FC",
          value: "logFC",
          filter: (value) => {
            if (!this.logFCLowerBoundInput && !this.logFCUpperBoundInput)
              return true;
            return (
              value >= this.logFCUpperBoundInput ||
              value <= this.logFCLowerBoundInput
            );
          },
        },
        {
          text: "pValue",
          value: "pValue",
          filter: (value) => {
            if (!this.pValInput) return true;
            return value <= this.pValInput;
          },
        },
        {
          text: "Adjusted pValue",
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
          result.pValue <= this.pValInput &&
          (result.logFC <= this.logFCLowerBoundInput ||
            result.logFC >= this.logFCUpperBoundInput)
      );
    },
  },
  methods: {
    pathwayEnrichmentButtonClicked() {
      if (_isEqual(this.filteredPathwayGenes, this.filteredGenes)) return;
      this.filteredPathwayGenes = this.filteredGenes;
      this.$emit("doPathwayEnrichmentAnalysis", this.filteredPathwayGenes);
      this.show = false;
    },
    fiNetowrkButtonClicked() {
      if (_isEqual(this.filteredFINetworkGenes, this.filteredGenes)) return;
      this.filteredFINetworkGenes = this.filteredGenes;
      this.$emit("doFINetworkAnalysis", {
        absLogFC: this.absLogFCInput,
        adjPValue: this.adjustedPValInput,
        genes: this.filteredFINetworkGenes.slice(0, 225),
      });
      this.show = false;
    },
    async loadTestData() {
      // This is used only for test. A Vue Warn will be thrown for modifying a prop here.
      this.geneExpressionResults = await ImmportService.fetchTestGeneExpressionAnalysis()
    }
  },
};
</script>

<style scoped>
.flex {
  align-self: center;
  justify-content: space-around;
}
.log-text {
  padding: 0 1em;
  margin: 0 !important;
  align-self: bottom;
}
.union {
  margin: 5px;
}
</style>