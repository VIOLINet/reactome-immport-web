<template>
  <v-container fluid class="wrapper">
    <v-tabs :centered="true">
      <v-tab>Reactome Enrichment Analysis</v-tab>
      <v-tab-item>
        <v-card tile>
          <v-card-title>
            Pathways 
            <v-spacer></v-spacer>
            <v-text-field
            v-model="search"
            label="Search by Pathway..."
            single-line
            hide-details
          ></v-text-field>
          </v-card-title>
          <v-data-table
            dense
            :headers="analysisHeaders"
            :items="analysisDataPathways"
            class="elevation-1"
            :search="search"
            :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
          >
            <template v-slot:item.name="{item}">
              <a
                :href="`https://dev.reactome.org/PathwayBrowser/#/${item.stId}&DTAB=AN&ANALYSIS=${analysisDataSummary.token}`"
                target="_blank"
                title="View in Reactome"
              >{{item.name}}</a>
            </template>

            <template v-slot:item.entities.found="{item}">{{item.entities.found}}</template>
            <template v-slot:item.entities.total="{item}">{{item.entities.total}}</template>

            <template
              v-slot:item.entities.ratio="{item}"
            >{{item.entities.ratio.toExponential(2)}}</template>
            <template
              v-slot:item.entities.pValue="{item}"
            >{{item.entities.pValue.toExponential(2)}}</template>
            <template
              v-slot:item.entities.fdr="{item}"
            >{{item.entities.fdr.toExponential(2)}}</template>
            <template v-slot:footer="{}">
              <a
                :href="`https://dev.reactome.org/PathwayBrowser/#/DTAB=AN&ANALYSIS=${analysisDataSummary.token}`"
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
        </v-card>
      </v-tab-item>
      <v-tab>Functional Interactions</v-tab>
      <v-tab-item>
        <v-card tile>
          <v-card-text>
            <cytoscape ref="cy" :config="cyConfig" :afterCreated="afterCreated"></cytoscape>
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
    analysisDataSummary: {
      type: Object,
      default: () => {}
    },
    analysisDataPathways: {
      type: Array,
      default: () => []
  },
    fiData: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    search: '',
    analysisHeaders: [
      { text: "Pathway Name", value: "name" },
      { text: "Entities Found", value: "entities.found" },
      { text: "Entities Total", value: "entities.total" },
      { text: "Entities Ratio", value: "entities.ratio" },
      { text: "Entities pValue", value: "entities.pValue" },
      { text: "Entities FDR", value: "entities.fdr" }
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
    }
  }
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