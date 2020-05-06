<template>
  <v-container fluid class="wrapper">
    <v-tabs :centered="true">
      <v-tab>Reactome Enrichment Analysis</v-tab>
      <v-tab-item>
        <v-data-table
          dense
          :headers="analysisHeaders"
          :items="analysisData.pathways"
          :items-per-page="20"
          class="elevation-1"
        >
          <template v-slot:item.pathways.name="{item}">
            <a
              :href="`https://dev.reactome.org/PathwayBrowser/#/${item.stId}&DTAB=AN&ANALYSIS=${analysisData.summary.token}`"
              target="_blank"
              title="View in Reactome"
            >{{item.name}}</a>
          </template>

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
          <template v-slot:footer="{}">
            <a
              :href="`https://dev.reactome.org/PathwayBrowser/#/DTAB=AN&ANALYSIS=${analysisData.summary.token}`"
              target="_blank"
            >
              <img
                :src="'/static/images/reactome_icon.png'"
                alt="Reactome Icon"
                class="smallIcon"
                title="Open Reactome"
              />
            </a>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab @click="setInitialLayout">Functional Interactions</v-tab>
      <v-tab-item>
        <v-card tile>
          <v-card-text>
            <cytoscape ref="cy" :config="cyConfig" :afterCreated="afterCreated">
            </cytoscape>
            <div id="cyto" refs="cyto"></div>
          </v-card-text>
        </v-card>
      </v-tab-item>
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
      type: Array,
      default: () => []
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
    ],
    cyConfig: {
      style: [
        {
          selector: "node",
          style: {
            width: "9",
            height: "9",
            label: "data(name)",
            "font-size": "6px",
            shape: "ellipse",
            "background-color": "#00CC00",
            "border-color": "#00CC00",
            "background-opacity": ".4"
          }
        },
        {
          selector: "node:selected",
          style: {
            "border-width": "6px",
            "border-color": "#AAD8FF",
            "border-opacity": "0.5",
            "text-outline-color": "#0bb50b"
          }
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "line-color": "#bbb",
            width: "1",
            "overlay-padding": "20px"
          }
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#FF0000",
            width: "2"
          }
        }
      ],
      layout: {
        name: "cose"
      }
    },
    cyInitialized: false
  }),
  methods: {
    afterCreated(cy) {
      this.cy = cy;
      cy.layout({ name: "cose" }).run();
      this.addInitialNodes();
    },
    addInitialNodes() {
      this.cy.add(this.fiData);
      this.cy.layout({ name: "cose" }).run();
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 90%;
}
.smallIcon {
  max-width: 2em;
  float: left;
  margin: 0.5em;
}
table th {
  border-left: 1px solid #dddddd;
}
table td {
  border-left: 1px solid #dddddd;
}
</style>