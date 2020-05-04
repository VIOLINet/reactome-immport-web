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
              <img :src="'/static/images/reactome_icon.png'" alt="Reactome Icon" class="smallIcon" title="Open Reactome"/>
            </a>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab>Functional Interactions</v-tab>
      <v-tab-item>
        <v-card raised>
          <v-card-text>
            <cytoscape ref="cy" :config="cyConfig" style="border:1px solid black;">
              <cy-element v-for="def in fiData" :key="`${def.data.id}`" :definition="def" />
            </cytoscape>
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
    cyConfig: { style: [
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
        selector: "node.overlay",
        style: {
          "background-color": "data(color)",
          "border-color": "data(color)",
          "background-opacity": ".8"
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
      },
      {
        selector: "edge.highlighted",
        style: {
          "line-color": "#FF0000"
        }
      },
      {
        selector: "edge.hovered",
        style: {
          "line-color": "#0000FF"
        }
      },
      {
        selector: 'edge[direction="->"]',
        style: {
          "target-arrow-shape": "vee",
          "target-arrow-color": "#bbb"
        }
      },
      {
        selector: 'edge[direction="->"]:selected',
        style: {
          "target-arrow-shape": "vee",
          "target-arrow-color": "#FF0000"
        }
      },
      {
        selector: 'edge[direction="->"].hovered',
        style: {
          "target-arrow-shape": "vee",
          "target-arrow-color": "#0000FF"
        }
      },
      {
        selector: 'edge[direction="<-"]',
        style: {
          "source-arrow-shape": "vee",
          "source-arrow-color": "#bbb"
        }
      },
      {
        selector: 'edge[direction="<-"]:selected',
        style: {
          "source-arrow-shape": "vee",
          "source-arrow-color": "#FF0000"
        }
      },
      {
        selector: 'edge[direction="<-"].hovered',
        style: {
          "source-arrow-shape": "vee",
          "source-arrow-color": "#0000FF"
        }
      },
      {
        selector: 'edge[direction="-|"]',
        style: {
          "target-arrow-shape": "tee",
          "target-arrow-color": "#bbb"
        }
      },
      {
        selector: 'edge[direction="-|"]:selected',
        style: {
          "target-arrow-shape": "tee",
          "target-arrow-color": "#FF0000"
        }
      },
      {
        selector: 'edge[direction="-|"].hovered',
        style: {
          "target-arrow-shape": "tee",
          "target-arrow-color": "#0000FF"
        }
      },
      {
        selector: 'edge[direction="|-"]',
        style: {
          "source-arrow-shape": "tee",
          "source-arrow-color": "#bbb"
        }
      },
      {
        selector: 'edge[direction="|-"]:selected',
        style: {
          "source-arrow-shape": "tee",
          "source-arrow-color": "#FF0000"
        }
      },
      {
        selector: 'edge[direction="|->"]',
        style: {
          "source-arrow-shape": "tee",
          "source-arrow-color": "#bbb",
          "target-arrow-shape": "vee",
          "target-arrow-color": "#bbb"
        }
      },
      {
        selector: 'edge[direction="|->"]:selected',
        style: {
          "source-arrow-shape": "tee",
          "source-arrow-color": "#FF0000",
          "target-arrow-shape": "vee",
          "target-arrow-color": "#FF0000"
        }
      },
      {
        selector: 'edge[direction="<-|"]',
        style: {
          "source-arrow-shape": "vee",
          "source-arrow-color": "#bbb",
          "target-arrow-shape": "tee",
          "target-arrow-color": "#bbb"
        }
      },
      {
        selector: 'edge[direction="<-|"]:selected',
        style: {
          "source-arrow-shape": "vee",
          "source-arrow-color": "#FF0000",
          "target-arrow-shape": "tee",
          "target-arrow-color": "#FF0000"
        }
      },
      {
        selector: 'node[interactor="true"]',
        style: {
          shape: "triangle"
        }
      },
      {
        selector: 'node[drug="true"]',
        style: {
          shape: "hexagon"
        }
      },
      {
        selector: 'edge[lineStyle="positive"]',
        style: {
          "line-style": "dashed"
        }
      },
      {
        selector: 'edge[lineStyle="negative"]',
        style: {
          "line-style": "dotted"
        }
      }
    ],
    layout: {
      name: 'grid',
      rows: 1
    }}
  })
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
/deep/ canvas {
  top: 0;
  left: 0;
}
</style>