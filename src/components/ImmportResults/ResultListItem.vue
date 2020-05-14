<template>
  <v-container fluid>{{this.fiData}}</v-container>
</template>

<script>
export default {
  name: "ResultListItem",
  props: {
    result: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    search: "",
    analysisHeaders: [
      { text: "Pathway Name", value: "name" },
      { text: "Entities Found", value: "entities.found" },
      { text: "Entities Total", value: "entities.total" },
      { text: "Entities Ratio", value: "entities.ratio" },
      { text: "Entities pValue", value: "entities.pValue" },
      { text: "Entities FDR", value: "entities.fdr" }
    ],
    analysisSummary: {},
    analysisPathways: [],
    fiData: []
  }),
  created() {
    this.analysisSummary = this.result.analysisData.summary;
    this.analysisPathways = this.result.analysisData.pathways;
    this.fiData = this.result.fiData;
  }
};
</script>

<style scoped>
.smallIcon {
  max-width: 2em;
  float: left;
  margin: 0.5em;
}
</style>