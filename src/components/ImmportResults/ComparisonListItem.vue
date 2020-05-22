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
              <v-data-table dense :headers="comparisonHeaders" :items="pathways">
                  <template v-slot:item.sourceEntitiesPValue="{item}">
                      {{item.sourceEntitiesPValue.toExponential(2)}}
                  </template>
                  <template v-slot:item.sourceEntitiesFDR="{item}">
                      {{item.sourceEntitiesFDR.toExponential(2)}}
                  </template>
                  <template v-slot:item.targetEntitiesPValue="{item}">
                      {{item.targetEntitiesPValue.toExponential(2)}}
                  </template>
                  <template v-slot:item.targetEntitiesFDR="{item}">
                      {{item.targetEntitiesFDR.toExponential(2)}}
                  </template>
              </v-data-table>
          </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ComparisonListItem",
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
    expandCard: true
  }),
  created() {
    this.pathways = this.comparison.pathways;
  },
  computed: {
    panelName() {
      return `Comparing Results ${this.comparison.resultSets[0]} to Results ${this.comparison.resultSets[1]}`
    }
  }
};
</script>

<style scoped>
</style>