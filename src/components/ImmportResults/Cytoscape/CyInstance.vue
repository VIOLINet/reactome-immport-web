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
        <v-card
          v-show="show && !comparisonSet"
          raised
          elevation="5"
          class="filterCard pa-3"
        >
          <v-text-field
            class="mr-3"
            prefix="Total Genes"
            v-model="totalNodesInput"
            type="number"
            min="0"
            max="225"
            dense
            :rules="[v => v <= 225 || '225 max genes']"
            :hide-details="totalNodesInput <= 225"
            @keyup.enter="updateTotalNodes"
          ></v-text-field>
          <v-text-field
            class="mr-3"
            prefix="logFC≤"
            v-model="absLogFCInput"
            type="number"
            min="0"
            max="1"
            dense
            hide-details
            @keyup.enter="filterOutNodes"
          ></v-text-field>
          <v-text-field
            prefix="adjPValue≤"
            v-model="pValueInput"
            type="number"
            min="0"
            max="1"
            dense
            hide-details
            @keyup.enter="filterOutNodes"
          ></v-text-field>
        </v-card>
        <v-card
          v-show="show && comparisonSet"
          raised
          elevation="5"
          class="legendCard pa-3"
        >
          <ComparisonLegend />
        </v-card>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
// import Vue from 'vue';
import ComparisonLegend from "./ComparisonLegend";
import ImmportService from "../../../service/ImmportService";
export default {
  name: "CyInstance",
  components: {
    ComparisonLegend,
  },
  props: {
    cyElementsProp: {
      type: Array,
      default: () => [],
    },
    comparisonSet: {
      type: Boolean,
      default: () => false,
    },
    filterProps: {
      type: Object,
      default: () => ({
        absLogFC: 0,
        adjPValue: 1,
      }),
    },
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
            "source-arrow-shape": "vee",
            "target-arrow-shape": "vee",
          },
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
            "source-arrow-shape": "tee",
            "target-arrow-shape": "tee",
          },
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
            "source-arrow-color": "data(lineColor)",
            "target-arrow-color": "data(lineColor)",
          },
        },
        {
          selector: "node[nodeColor]",
          style: {
            "background-color": "data(nodeColor)",
          },
        },
        {
          selector: "edge:selected",
          style: {
            "line-color": "#FF0000",
            "source-arrow-color": "#F00",
            "target-arrow-color": "#FF0000",
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
    filteredOutCyElements: {},
    showClusters: false,
    clustersLoaded: false,
    expressionInput: 0,
    absLogFCInput: 1,
    pValueInput: 1,
    totalNodesInput: 0,
  }),
  created() {
    this.absLogFCInput = this.filterProps.absLogFC;
    this.pValueInput = this.filterProps.adjPValue;
    this.cyElements = this.cyElementsProp;
    this.totalNodesInput = this.totalNodes;
  },
  watch: {
    showClusters(newVal) {
      if (!this.clustersLoaded) this.loadClustering();
      else this.doClusterToggle(newVal);
    },
    cyElementsProp(newVal) {
      this.absLogFCInput = this.filterProps.absLogFC;
      this.pValueInput = this.filterProps.adjPValue;
      this.filteredOutCyElements = {}
      this.cy.elements().remove();
      this.cyElements = newVal;
      this.cy.add(this.cyElements);
      this.totalNodesInput = this.totalNodes;
      this.cy.elements().layout({ name: "cose" }).run();
      this.totalNodesInput = this.totalNodes
    },
  },
  computed: {
    totalNodes() {
      return this.cyElementsProp.filter((ele) => ele.group === "nodes").length;
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
    async loadClustering() {
      try {
        const data = await ImmportService.fetchClusteredFINework(
          this.cyElements
        );
        this.addClusteringToFIData(data);
        this.doClusterToggle(true);
      } catch (err) {
        console.log(err);
      }
    },
    addClusteringToFIData(map) {
      //first restore all filtered nodes to cytoscape so that all get cluster data added
      if (this.filteredOutCyElements.elementsForCy)
        this.filteredOutCyElements.elementsForCy.restore();
      for (const [key, value] of Object.entries(map)) {
        if (value === null) continue;
        this.cy.$(`#${key}`).data("clusterColor", value);
      }
      this.clustersLoaded = true;

      //refilter out nodes that do not meet expression and pValue filter criteria
      if (this.filteredOutCyElements.elementsForCy)
        this.cy.remove(this.filteredOutCyElements.elementsForCy);
    },
    doClusterToggle(show) {
      if (show) {
        this.cy.elements("[clusterColor]").addClass("showClusters");
      } else {
        this.cy.elements("[clusterColor]").removeClass("showClusters");
      }
    },
    filterOutNodes() {
      //if user changes limit for total nodes to something higher than available, load new network
      if (this.totalNodesInput > this.totalNodes) {
        this.updateTotalNodes();
        return;
      }

      //restore previously removed nodes
      if (this.filteredOutCyElements.elementsForCy) {
        this.filteredOutCyElements.elementsForCy.restore();
        // this.filteredOutCyElements.edgesForCy.restore();
      }

      //remove nodes and add return to object for restore later
      this.filteredOutCyElements.elementsForCy = this.cy.remove(
        "node[absLogFC  <=" +
          this.absLogFCInput +
          "], node[adjPValue >= " +
          this.pValueInput +
          "]"
      );
      // this.filteredOutCyElements.edgesForCy = this.cy.filter(
      //   "node[absLogFC  <=" +
      //     this.absLogFCInput +"], node[adjPValue >= " +
      //     this.pValueInput +
      //     "]"
      // ).connectedEdges()

      // this.cy.remove(this.filteredOutCyElements.elementsForCy)

      //if not a comparison set, want to make sure clusters are shown when nodes are restored
      if (!this.comparisonSet) this.doClusterToggle(this.showClusters);
    },
    updateTotalNodes() {
      this.$emit("updateTotalNodes", {
        totalNodes: this.totalNodesInput,
        absLogFC: this.absLogFCInput,
        adjPValue: this.pValueInput,
      });
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
.filterCard {
  position: absolute;
  align-items: center;
  width: 450px;
  display: flex;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0%);
}
.legendCard {
  position: absolute;
  bottom: 50%;
  right: 10px;
  transform: translate(0, 50%);
}
</style>