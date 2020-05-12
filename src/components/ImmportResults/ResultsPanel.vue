<template>
  <v-container fluid class="wrapper">
    <v-tabs :centered="true">
      <v-tab>Reactome Enrichment Analysis</v-tab>
      <v-tab-item>
        <v-card outlined>
          <v-card-title>
            Pathways
            <v-spacer></v-spacer>
            <v-text-field v-model="search" label="Search by Pathway..." single-line hide-details></v-text-field>
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
                title="View Analyzed Pathway in Reactome"
              >{{item.name}}</a>
            </template>

            <template v-slot:item.entities.found="{item}">{{item.entities.found}}</template>
            <template v-slot:item.entities.total="{item}">{{item.entities.total}}</template>

            <template v-slot:item.entities.ratio="{item}">{{item.entities.ratio.toExponential(2)}}</template>
            <template v-slot:item.entities.pValue="{item}">{{item.entities.pValue.toExponential(2)}}</template>
            <template v-slot:item.entities.fdr="{item}">{{item.entities.fdr.toExponential(2)}}</template>
            <template v-slot:footer="{}">
              <a
                :href="`https://dev.reactome.org/PathwayBrowser/#/DTAB=AN&ANALYSIS=${analysisDataSummary.token}`"
                target="_blank"
              >
                <img
                  :src="'/static/images/reactome_icon.png'"
                  alt="Reactome Icon"
                  class="smallIcon"
                  title="View Detailed Results in Reactome"
                />
              </a>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
      <v-tab>Functional Interactions</v-tab>
      <v-tab-item>
        <v-card outlined>
          <v-card-text>
            <v-card outlined>
              <cytoscape ref="cy" :config="cyConfig" :afterCreated="afterCreated"></cytoscape>
            </v-card>
          </v-card-text>
          <v-container>
            <v-btn @click="onClusterToggleClicked">Cluster Network</v-btn>
          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "ResultsPanel",
  props: {
    immportRequestData: {
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
          selector: "node.showClusters",
          style: {
            "background-color": "data(clusterColor)"
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
    clusteringAdded: false,
    analysisDataSummary: {},
    analysisDataPathways: [],
    fiData: [],
    showClusters: false
  }),
  watch: {
    immportRequestData: {
      deep: true,
      handler() {
        this.analysisDataSummary = {};
        this.analysisDataPathways = [];
        this.fiData = [];
        this.clusteringAdded = false;
        this.showClusters = false;
        this.loadData();
      }
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      axios
        .get("http://localhost:8076/immportws/analysis/pathways")
        .then(response => {
          this.analysisDataSummary = response.data.summary;
          this.analysisDataPathways = response.data.pathways;
          return axios.get(
            "http://localhost:8076/immportws/analysis/fi_network"
          );
        })
        .then(response => {
          this.fiData = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    afterCreated(cy) {
      this.cy = cy;
      this.addInitialNodes();
    },
    addInitialNodes() {
      this.cy.add(this.fiData);
      this.cy.layout({ name: "cose" }).run();
    },
    onClusterToggleClicked() {
      if (!this.clusteringAdded) this.loadClusterData();
      else this.doClusterToggle();
    },
    loadClusterData() {
      axios
        .post(
          "http://localhost:8076/immportws/analysis/clustered_fi_network",
          this.fiData
        )
        .then(response => {
          this.fiData = response.data;
          this.clusteringAdded = true;
          this.cy.elements().remove();
          this.addInitialNodes();
          this.doClusterToggle();
        })
        .catch(error => {
          console.error(error);
        });
    },
    doClusterToggle() {
      if (!this.showClusters) {
        this.cy.elements("[clusterColor]").addClass("showClusters");
      } else {
        this.cy.elements("[clusterColor]").removeClass("showClusters");
      }
      this.showClusters = !this.showClusters;
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