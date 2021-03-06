<template>
  <v-app id="app">
    <Docs />
    <v-container fluid>
      <GeneExpressionAnalysisForm
        :currentResultNames="resultSets.map((set) => set.displayName)"
        @analyzeData="analyzeData"
        class="mb-5"
      />
      <section>
        <CompareResultsPanel
          v-for="comparison in comparisonSets"
          :key="comparison[0] + comparison[1]"
          :id="comparison[0] + comparison[1]"
          :compareFrom="resultSets.find((rs) => rs.id === comparison[0])"
          :compareTo="resultSets.find((rs) => rs.id === comparison[1])"
          @closeComparison="closeComparison"
        />
      </section>
      <hr v-if="comparisonSets.length > 0" class="my-5" />
      <section>
        <v-card outlined v-if="loadingReactomeAnalyses">
          <v-card-text>
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
        <GeneExpResultPanel
          v-for="item in resultSets"
          :key="item.id"
          :id="item.id"
          :resultSet="item"
          @closeResults="closeResults"
          @fetchPathwayEnrichmentAnalysis="fetchPathwayEnrichmentAnalysis"
          @fetchNetworkAnalysis="fetchNetworkAnalysis"
          @compareResults="compareResults"
          class="mt-5"
        >
          <template v-slot:[`${compareFromId}`]>
            <v-overlay opacity=".8" :value="showCompareFromForm"
              ><ComparisonForm
                :compareFromId="compareFromId"
                :resultSets="resultSets"
                @cancelComparison="showCompareFromForm = false"
                @addComparison="addComparison"
            /></v-overlay>
          </template>
        </GeneExpResultPanel>
      </section>
    </v-container>
  </v-app>
</template>

<script>
import ImmportService from "./service/ImmportService";
import GeneExpressionAnalysisForm from "./components/Forms/GeneExpressionAnalysisForm";
import GeneExpResultPanel from "./components/ImmportResults/GeneExpResultPanel";
import ComparisonForm from "./components/ImmportResults/Comparison/ComparisonForm";
import CompareResultsPanel from "./components/ImmportResults/Comparison/CompareResultsPanel";
import Docs from "./components/Docs";
import _isEqual from "lodash/isEqual";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "App",
  components: {
    GeneExpressionAnalysisForm,
    GeneExpResultPanel,
    Docs,
    ComparisonForm,
    CompareResultsPanel,
  },
  data: () => ({
    geneExpAnalysis: [],
    reactomeAnalyses: null,
    resultSets: [],
    comparisonSets: [],
    loadingReactomeAnalyses: false,
    showCompareFromForm: false,
    compareFromId: undefined,
  }),
  watch: {
    resultSets(newVal, oldVal) {
      //return if result set was removed instead of added
      if (newVal.length < oldVal.length) return;
      setTimeout(() => {
        document.getElementById(this.resultSets[0].id).scrollIntoView();
      }, 250);
    },
    comparisonSets(newVal, oldVal) {
      //return if comparison set was removed instead of added
      if (newVal.length < oldVal.length) return;
      setTimeout(() => {
        const set = this.comparisonSets[this.comparisonSets.length - 1];
        const str = `${set[0]}${set[1]}`;
        document.getElementById(str).scrollIntoView();
      }, 250);
    },
  },
  methods: {
    async analyzeData(data) {
      //return if form submission with same data already exists
      if (this.resultSets.some((sub) => _isEqual(sub.formData, data.formData)))
        return;

      //load gene expression analysis before unshifting
      await this.loadGeneExpressionAnalysis(data);
      data.id = uuidv4();
      data.enrichmentResults = {};
      data.fiNetwork = { network: [], absLogFC:0, adjPValue:1 };
      this.resultSets.unshift(data);
    },
    async loadGeneExpressionAnalysis(data) {
      this.loadingReactomeAnalyses = true;
      try {
        data.geneExpressionResults = await ImmportService.fetchGeneExpressionAnalysis(
          data.analysisData
        );
      } catch (err) {
        console.log(err);
        this.loadingReactomeAnalyses = false;
      }
      this.loadingReactomeAnalyses = false;
    },
    async fetchPathwayEnrichmentAnalysis(id, genes) {
      try {
        this.resultSets.find(
          (rs) => rs.id === id
        ).enrichmentResults = await ImmportService.fetchPathwayEnrichmentAnalysis(
          genes.map((gene) => gene.gene_name)
        );
        this.$forceUpdate();
      } catch (err) {
        console.log(err);
      }
    },
    async fetchNetworkAnalysis(id, props) {
      console.log(props.absLogFC)
      console.log(props.adjPValue)
      try {
        this.resultSets.find((rs) => rs.id === id).fiNetwork = {
          network: this.addExpressionToNodes(
            id,
            await ImmportService.fetchFINetwork(
              props.genes.map((gene) => gene.gene_name)
            )
          ),
          absLogFC: props.absLogFC,
          adjPValue: props.adjPValue,
        };
      } catch (err) {
        console.log(err);
      }
    },
    addExpressionToNodes(id, network) {
      const genes = this.resultSets.find((rs) => rs.id === id)
        .geneExpressionResults;
      network
        .filter((obj) => obj.group === "nodes")
        .forEach((node) => {
          const gene = genes.find((gene) => gene.gene_name === node.data.id);
          node.data.logFC = gene.logFC;
          node.data.absLogFC = Math.abs(gene.logFC)
          node.data.pValue = gene.pValue;
          node.data.adjPValue = gene.adjPValue;
        });
      return network;
    },
    closeResults(id) {
      //must close any comparison set that closed results is part of before removing to avoid error
      this.comparisonSets = this.comparisonSets.filter(
        (set) => !set.includes(id)
      );
      this.resultSets = this.resultSets.filter((sub) => sub.id !== id);
    },
    compareResults(id) {
      if (this.resultSets.length < 2) return;
      this.compareFromId = id;
      this.showCompareFromForm = true;
    },
    addComparison({ compareFrom, compareTo }) {
      const toAdd = [compareFrom, compareTo];
      if (this.comparisonSets.some((set) => _isEqual(set, toAdd))) return;

      this.compareFromId = undefined;
      this.comparisonSets.push(toAdd);
    },
    closeComparison(ids) {
      this.comparisonSets = this.comparisonSets.filter(
        (set) => !(set.includes(ids[0]) && set.includes(ids[1]))
      );
    },
  },
};
</script>

<style>
:root {
  /* Cyotoscape comparison node & line colors */
  --node-a-color: #848fa2;
  --node-b-color: #2d3142;
  --node-a-b-color: #058ed9;
  --edge-a-color: #e1daae;
  --edge-b-color: #ff934f;
  --edge-a-b-color: #910f0f;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
td {
  outline: 1px solid grey;
}
.searchColumn {
  width: 50%;
}
table {
  margin: 0 auto;
  width: 90%;
  padding: 0;
  border: 1px solid grey;
}
.checkBox {
  text-align: left;
}
.tableHeader {
  margin: 0 auto;
  padding: 0;
  width: 100%;
}
.multi-select {
  margin: 0.5em;
  width: 10em;
  height: 10em;
  border: 1px solid black;
}
.submitButton {
  margin: 0.5em;
}
#app canvas {
  /* Fix for cytoscape issue where canvas is placed incorrectly */
  left: 0;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* REMOVES SPINNERS FROM NUMBER INPUTS */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
/* END REMOVE SPINNERS STYLES */
</style>
