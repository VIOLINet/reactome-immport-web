<template>
  <v-container fluid class="wrapper">
    <v-tabs :centered="true">
      <v-tab>Reactome Enrichment Analysis</v-tab>
      <v-tab-item>
        <v-data-table
          dense
          :headers="analysisHeaders"
          :items="analysisData.pathways"
          :items-per-page="15"
          class="elevation-1"
        >
          <template v-slot:item.pathways.name="{item}"><a :href="`https://dev.reactome.org/PathwayBrowser/#/${item.stId}&DTAB=AN&ANALYSIS=${analysisData.summary.token}`" target="_blank">{{item.name}}</a></template>
          <template v-slot:item.pathways.entities.found="{item}">{{item.entities.found}}</template>
          <template v-slot:item.pathways.entities.total="{item}">{{item.entities.total}}</template>

          <template
            v-slot:item.pathways.entities.ratio="{item}"
          >{{item.entities.ratio.toExponential(2)}}</template>
          <template
            v-slot:item.pathways.entities.pValue="{item}"
          >{{item.entities.pValue.toExponential(2)}}</template>
          <template
            v-slot:item.pathways.entities.fdr="{item}"
          >{{item.entities.fdr.toExponential(2)}}</template>
          <template v-slot:footer="{}"><a :href="`https://dev.reactome.org/PathwayBrowser/#/DTAB=AN&ANALYSIS=${analysisData.summary.token}`" target="_blank"> <img :src="'/static/images/reactome_icon.png'" alt="Reactome Icon" class="smallIcon"> </a></template>
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
      type: Object,
      default: () => {}
    },
    fiData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    analysisHeaders: [
      { text: "Pathway Name", value: "pathways.name" },
      { text: "Entities Found", value: "pathways.entities.found" },
      { text: "Entities Total", value: "pathways.entities.total" },
      { text: "Entities Ratio", value: "pathways.entities.ratio" },
      { text: "Entities pValue", value: "pathways.entities.pValue" },
      { text: "Entities FDR", value: "pathways.entities.fdr" }
    ]
  })
};
</script>

<style scoped>
.wrapper {
  width: 90%;
}
.smallIcon {
  max-width: 2em;
  float:left;
  margin: .5em;
}
table th {
  border-left: 1px solid #dddddd;
}
table td {
  border-left: 1px solid #dddddd;
}
</style>