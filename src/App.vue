<template>
  <v-app id="app">
    <Docs />
    <v-container fluid>
      <GeneExpressionControl 
        @analyzeData="analyzeData"
        class="mb-5"
      />
      
      <GeneExpResults 
        v-if="reactomeAnalyses"
        :reactomeAnalyses="reactomeAnalyses"
      />
    </v-container>
  </v-app>
</template>

<script>
import GeneExpressionControl from "./components/Forms/GeneExpressionControl";
import GeneExpResults from "./components/ImmportResults/GeneExpResults";
import Docs from "./components/Docs";
import ImmportService from './service/ImmportService'

export default {
  name: "App",
  components: {
    GeneExpressionControl,
    GeneExpResults,
    Docs
  },
  data: () => ({
    geneExpAnalysis: [],
    reactomeAnalyses: null
  }),
  methods: {
    async analyzeData(data) {
      try{
       const analysis = await ImmportService.fetchReactomeAnalyses(data.analysisData);
        analysis.formData = {};
        Object.assign(analysis.formData, data.formData)

        this.reactomeAnalyses = analysis

      } catch(err) {
        console.log(err);
      }
    },
  }
};
</script>

<style>
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
  top: 0;
  left: 0;
}
</style>
