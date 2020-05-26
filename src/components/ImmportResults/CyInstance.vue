<template>
  <v-card outlined>
    <v-card-title v-if="panelName">{{panelName}}</v-card-title>
    <v-card-text style="position:relative;">
      <cytoscape ref="cy" :config="config" :afterCreated="afterCreated"></cytoscape>
      <v-btn icon @click="resetCytoscape" class="resetButton" title="Reset position">
        <v-icon>{{'mdi-restore'}}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="showClusters = !showClusters"
        class="clusterToggle"
        title="show/hide clustering"
      >
        <v-icon>{{showClusters ? 'mdi-check-box-outline' : 'mdi-checkbox-blank-outline'}}</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  name: "CyInstance",
  props: {
    title: {
      type: String,
      default: () => ""
    },
    cyElementsProp: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    config: {
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
      },
      maxZoom: 5,
      minZoom: 0.2
    },
    cyElements: [],
    showClusters: false,
    clustersLoaded: false
  }),
  created() {
    this.cyElements = this.cyElementsProp;
  },
  watch: {
    showClusters(newVal) {
      if (!this.clustersLoaded) this.loadClustering();
      else this.doClusterToggle(newVal);
    }
  },
  computed: {
    panelName() {
      return this.title === "" ? null : `Result ${this.title}`;
    }
  },
  methods: {
    afterCreated(cy) {
      this.cy = cy;
      this.cy.add(this.cyElements);
      this.cy.layout({ name: "cose" }).run();
    },
    resetCytoscape() {
      this.cy.fit();
    },
    loadClustering() {
      axios
        .post(
          "http://localhost:8076/immportws/analysis/clustered_fi_network",
          this.cyElements
        )
        .then(({ data }) => {
          this.addClusteringToFIData(data);
          this.doClusterToggle(true);
        })
        .catch(error => {
          console.error(error);
        });
    },
    addClusteringToFIData(map) {
      for (const [key, value] of Object.entries(map)) {
        if (value === null) continue;
        this.cy.$(`#${key}`).data("clusterColor", value);
      }
      this.clustersLoaded = true;
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
.resetButton {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
}
.clusterToggle {
  position: absolute;
  top: 40px;
  left: 5px;
  width: 10px;
}
</style>