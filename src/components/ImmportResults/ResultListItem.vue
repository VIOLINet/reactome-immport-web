<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        {{this.result.properties.voIds}}
        <v-spacer></v-spacer>
        <v-btn icon @click="expandCard = !expandCard">
          <v-icon>{{ expandCard ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <div v-show="expandCard" class="pa-1">
          <v-switch v-model="showClusters" label="Show Clustering"></v-switch>
          <v-card outlined>
            <cytoscape ref="cy" :config="cyConfig" :afterCreated="afterCreated"></cytoscape>
          </v-card>
          <v-data-table
            dense
            :headers="analysisHeaders"
            :items="analysisPathways"
            class="elevation-1"
            :search="search"
            :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
          >
            <template v-slot:item.name="{item}">
              <a
                :href="`https://dev.reactome.org/PathwayBrowser/#/${item.stId}&DTAB=AN&ANALYSIS=${analysisSummary.token}`"
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
                :href="`https://dev.reactome.org/PathwayBrowser/#/DTAB=AN&ANALYSIS=${analysisSummary.token}`"
                target="_blank"
              >
                <img
                  :src="'/static/images/reactome_icon.png'"
                  alt="Reactome Icon"
                  class="smallIcon"
                  title="View Detailed Results in Reactome"
                />
              </a>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                label="Search"
                hide-details
                single-line
                class="search-box"
              ></v-text-field>
            </template>
          </v-data-table>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: "ResultListItem",
  props: {
    result: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    expandCard: true,
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
    fiData: [],
    showClusters: false,
    clustersLoaded: false
  }),
  watch: {
    showClusters(newVal){
      if(!this.clustersLoaded)this.loadClustering();
      else this.doClusterToggle(newVal);

    }
  },
  created() {
    this.analysisSummary = this.result.analysisData.summary;
    this.analysisPathways = this.result.analysisData.pathways;
    this.fiData = this.result.fiData;
  },
  methods: {
    afterCreated(cy) {
      this.cy = cy;
      this.addInitialCyData();
    },
    addInitialCyData() {
      this.cy.add(this.fiData);
      this.cy.layout({ name: "cose" }).run();
    },
    loadClustering() {
      axios
        .post(
          "http://localhost:8076/immportws/analysis/clustered_fi_network",
          this.fiData
        )
        .then(response => {
          this.fiData = response.data;
          this.clustersLoaded = true;
          this.cy.elements().remove();
          this.addInitialCyData();
          this.doClusterToggle(true);
        })
        .catch(error => {
          console.error(error);
        });
    },
    doClusterToggle(show) {
      if (show) {
        this.cy.elements("[clusterColor]").addClass("showClusters");
      } else {
        this.cy.elements("[clusterColor]").removeClass("showClusters");
      }
    }
  }
};
</script>

<style scoped>
.smallIcon {
  max-width: 2em;
  float: left;
  margin: 0.5em;
}
.search-box {
  float: left;
  max-width: 25em;
}
</style>