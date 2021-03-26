<template>
  <v-card outlined>
    <v-card-title>
      <h4>Functional Interaction Network</h4>
      <v-spacer></v-spacer>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show" class="card-text">
        <cytoscape
          ref="cy"
          :config="config"
          :afterCreated="afterCreated"
        ></cytoscape>
        <v-btn
          v-show="show"
          icon
          @click="resetCytoscape"
          class="resetButton"
          title="Reset position"
        >
          <v-icon>{{ "mdi-restore" }}</v-icon>
        </v-btn>
        <v-btn
          v-show="show && !comparisonSet"
          icon
          @click="showClusters = !showClusters"
          class="clusterToggle"
          title="show/hide clustering"
        >
          <v-icon>{{
            showClusters
              ? "mdi-check-box-outline"
              : "mdi-checkbox-blank-outline"
          }}</v-icon>
        </v-btn>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  name: "CyInstance",
  props: {
    cyElementsProp: {
      type: Array,
      default: () => [],
    },
    comparisonSet: {
      type:Boolean,
      default: () => false
    }
  },
  data: () => ({
    show: true,
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
            "background-opacity": ".7",
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": "6px",
            "border-color": "#AAD8FF",
            "border-opacity": "0.5",
            "text-outline-color": "#0bb50b",
          },
        },
        {
          selector: "node.showClusters",
          style: {
            "background-color": "data(clusterColor)",
          },
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            width: "1",
            "overlay-padding": "20px",
          },
        },
        {
          selector: 'edge[direction="->"]',
          style: {
            "target-arrow-shape": "vee",
          },
        },
        {
          selector: 'edge[direction="<-"]',
          style: {
            "source-arrow-shape": "vee",
          },
        },
        {
          selector: 'edge[direction="<->"]',
          style: {
            "source-arrow-shape":"vee",
            "target-arrow-shape": "vee",
          }
        },
        {
          selector: 'edge[direction="-|"]',
          style: {
            "target-arrow-shape": "tee",
          },
        },
        {
          selector: 'edge[direction="|-"]',
          style: {
            "source-arrow-shape": "tee",
          },
        },
        {
          selector: 'edge[direction="|--|"]',
          style: {
            "source-arrow-shape":"tee",
            "target-arrow-shape": "tee",
          }
        },
        {
          selector: 'edge[direction="|->"]',
          style: {
            "source-arrow-shape": "tee",
            "target-arrow-shape": "vee",
          },
        },
        {
          selector: 'edge[direction="<-|"]',
          style: {
            "source-arrow-shape": "vee",
            "target-arrow-shape": "tee",
          },
        },
        {
          selector: "edge[lineColor]",
          style: {
            "line-color": "data(lineColor)",
            "source-arrow-color":"data(lineColor)",
            "target-arrow-color":"data(lineColor)"
          },
        },
        {
          selector: "node[nodeColor]",
          style: {
            "background-color": "data(nodeColor)"
          }
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#FF0000",
            width: "2",
          },
        },
      ],
      layout: {
        name: "cose",
      },
      maxZoom: 5,
      minZoom: 0.2,
    },
    cyElements: [],
    showClusters: false,
    clustersLoaded: false,
  }),
  created() {
    this.cyElements = this.cyElementsProp;
  },
  watch: {
    showClusters(newVal) {
      if (!this.clustersLoaded) this.loadClustering();
      else this.doClusterToggle(newVal);
    },
    cyElementsProp(newVal) {
      this.cy.elements().remove()
      this.cyElements = newVal;
      this.cy.add(
        this
          .cyElements
      );
      this.cy.elements().layout({ name: "cose" }).run();
    },
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
        .catch((error) => {
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
    },
  },
};
</script>

<style scoped>
.resetButton {
  position: absolute;
  top: 65px;
  left: 5px;
  width: 10px;
}
.clusterToggle {
  position: absolute;
  top: 100px;
  left: 5px;
  width: 10px;
}
</style>