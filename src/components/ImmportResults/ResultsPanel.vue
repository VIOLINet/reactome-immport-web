<template>
  <v-container fluid class="wrapper">
    <v-tabs :centered="true">
      <v-tab>Reactome Enrichment Analysis</v-tab>
      <v-tab-item>
        <v-data-table
          dense
          :headers="analysisHeaders"
          :items="analysisData"
          :items-per-page="15"
          class="elevation-1"
        >
          <template v-slot:item.entities.ratio="{item}">{{item.entities.ratio.toExponential(2)}}</template>
          <template v-slot:item.entities.pValue="{item}">{{item.entities.pValue.toExponential(2)}}</template>
          <template v-slot:item.entities.fdr="{item}">{{item.entities.fdr.toExponential(2)}}</template>
          <template v-slot:footer><a href="#"> <img :src="'/static/images/reactome_icon.png'" alt="Reactome Icon" class="smallIcon"> </a></template>
        </v-data-table>
      </v-tab-item>
      <v-tab>Functional Interactions</v-tab>
      <v-tab-item>TEST2</v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  name: "ResultsPanel",
  props: {
    analysisData: {
      type: Array,
      default: () => []
    },
    fiData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    analysisHeaders: [
      { text: "Pathway Name", value: "name" },
      { text: "Entities Found", value: "entities.found" },
      { text: "Entities Total", value: "entities.total" },
      { text: "Entities Ratio", value: "entities.ratio" },
      { text: "Entities pValue", value: "entities.pValue" },
      { text: "Entities FDR", value: "entities.fdr" }
    ]
  })
};
</script>

<style scoped>
.wrapper {
  width: 90%;
}
.smallIcon{
    max-width: 2em;
}
table th { border-left:1px solid #dddddd; }
table td { border-left:1px solid #dddddd; }
</style>