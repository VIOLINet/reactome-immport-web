<template>
  <v-app id="app">
    <Docs />
    <v-container fluid>
      <GeneExpressionControl 
        @analyzeData="analyzeData"
        class="mb-5"
      />
      <GeneExpResultPanel 
        v-for="(item, index) in formSubmissions"
        :key="index"
        :formSubmission="item"
        class="mb-5"
      />
    </v-container>
  </v-app>
</template>

<script>
import GeneExpressionControl from "./components/Forms/GeneExpressionControl";
import GeneExpResultPanel from "./components/ImmportResults/GeneExpResultPanel";
import Docs from "./components/Docs";
import _isEqual from "lodash/isEqual";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "App",
  components: {
    GeneExpressionControl,
    GeneExpResultPanel,
    Docs
  },
  data: () => ({
    geneExpAnalysis: [],
    reactomeAnalyses: null,
    formSubmissions: []
  }),
  methods: {
    analyzeData(data) {
      if(this.formSubmissions.some(sub => _isEqual(sub.formData, data.formData))) return;
        data.id = uuidv4();
        this.formSubmissions.unshift(data)
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
  left: 0; 
}
</style>
