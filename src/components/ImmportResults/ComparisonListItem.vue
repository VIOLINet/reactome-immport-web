<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        {{this.panelName}}
        <v-spacer></v-spacer>
        <v-btn icon @click="expandCard = !expandCard">
          <v-icon>{{ expandCard ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('removeComparison', comparison.resultSets)">
          <v-icon>{{ 'mdi-close' }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <div v-show="expandCard" class="pa-1">
          <v-tabs :centered="true">
            <v-tab>Reactome Enrichment Comparison</v-tab>
            <v-tab-item>
              <v-data-table
                dense
                :headers="comparisonHeaders"
                :items="pathways"
                :search="search"
                :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
              >
                <template
                  v-slot:item.sourceEntitiesPValue="{item}"
                >{{item.sourceEntitiesPValue.toExponential(2)}}</template>
                <template
                  v-slot:item.sourceEntitiesFDR="{item}"
                >{{item.sourceEntitiesFDR.toExponential(2)}}</template>
                <template
                  v-slot:item.targetEntitiesPValue="{item}"
                >{{item.targetEntitiesPValue.toExponential(2)}}</template>
                <template
                  v-slot:item.targetEntitiesFDR="{item}"
                >{{item.targetEntitiesFDR.toExponential(2)}}</template>
                <template v-slot:footer="{}">
                  <v-text-field v-model="search" label="Search" hide-details single-line class="search-box"></v-text-field>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab>Functional Interactions</v-tab>
            <v-tab-item>
              <v-btn @click="showShared = !showShared">Toggle Shared Interactions</v-btn>
                <v-row no-gutters>
                  <v-col cols="12" lg="6" v-for="(fiData, index) in comparison.fiNetworks" :key="index">
                    <CyInstance :title="`${comparison.resultSets[index]}`" :cyElementsProp="fiData" :showShared="showShared"/>
                  </v-col>
                </v-row>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
import CyInstance from './CyInstance';
export default {
  name: "ComparisonListItem",
  components: {
    CyInstance
  },
  props: {
    comparison: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    comparisonHeaders: [
      { text: "Pathway Name", value: "name" },
      { text: "p-Value¹", value: "sourceEntitiesPValue" },
      { text: "FDR¹", value: "sourceEntitiesFDR" },
      { text: "p-Value²", value: "targetEntitiesPValue" },
      { text: "FDR²", value: "targetEntitiesFDR" }
    ],
    pathways: [],
    expandCard: true,
    showShared: false,
    search: ""
  }),
  created() {
    this.pathways = this.comparison.pathways;
  },
  computed: {
    panelName() {
      return `Comparing Results ${this.comparison.resultSets[0]} to Results ${this.comparison.resultSets[1]}`;
    }
  },
};
</script>

<style scoped>
.search-box {
  float: left;
  max-width: 25em;
}
</style>