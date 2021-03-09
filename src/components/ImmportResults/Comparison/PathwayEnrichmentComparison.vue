<template>
  <v-card outlined>
    <v-card-title class="flex">
      <h4>Pathway Enrichment Comparison</h4>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-if="show">
        <v-data-table dense :headers="pathwayEnrichmentHeaders" :items="items">
          <template
            v-for="(h, index) in pathwayEnrichmentHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <span :key="index" v-html="header.text"></span>
          </template>
          <template v-slot:item.entities1.ratio="{ item }">
            <p :title="item.entities1 && item.entities1.ratio">
              {{ item.entities1 && item.entities1.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities2.ratio="{ item }">
            <p :title="item.entities2 && item.entities2.ratio">
              {{ item.entities2 && item.entities2.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities1.pValue="{ item }">
            <p :title="item.entities1 && item.entities1.pValue">
              {{ item.entities1 && item.entities1.pValue.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities2.pValue="{ item }">
            <p :title="item.entities2 && item.entities2.pValue">
              {{ item.entities2 && item.entities2.pValue.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities1.fdr="{ item }">
            <p :title="item.entities1 && item.entities1.fdr">
              {{ item.entities1 && item.entities1.fdr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities2.fdr="{ item }">
            <p :title="item.entities2 && item.entities2.fdr">
              {{ item.entities2 && item.entities2.fdr.toExponential(2) }}
            </p>
          </template>
        </v-data-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "PathwayEnrichmentComparison",
  props: {
    pathwayEnrichmentOne: {
      type: Object,
      default: () => {},
    },
    pathwayEnrichmentTwo: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    show: false,
  }),
  computed: {
    pathwayEnrichmentHeaders() {
      return [
        { text: "Stable Identifier", value: "stId" },
        { text: "Pahtway Name", value: "name" },
        { text: "Entities Found" + "1".sup(), value: "entities1.found" },
        { text: "Entities Found" + "2".sup(), value: "entities2.found" },
        { text: "Entities Ratio" + "1".sup(), value: "entities1.ratio" },
        { text: "Entities Ratio" + "2".sup(), value: "entities2.ratio" },
        { text: "PVal" + "1".sup(), value: "entities1.pValue" },
        { text: "PVal" + "2".sup(), value: "entities2.pValue" },
        { text: "FDR" + "1".sup(), value: "entities1.fdr" },
        { text: "FDR" + "2".sup(), value: "entities2.fdr" },
      ];
    },
    items() {
      const pathwaysOne = this.pathwayEnrichmentOne.pathways;
      const pathwaysTwo = this.pathwayEnrichmentTwo.pathways;

      const items = [];

      //add all primary pathways
      pathwaysOne.forEach((pathway) => {
        const secondaryPW = pathwaysTwo.find((pw) => pw.stId === pathway.stId);
        if(secondaryPW) pathwaysTwo.filter(pw => pw.stId !== pathway.stId)
        items.push({
          stId: pathway.stId,
          name: pathway.name,
          entities1: pathway.entities,
          entities2: secondaryPW ? secondaryPW.entities : undefined,
        });
      });

      //add secondary pathways not part of primary pathways
      pathwaysTwo
        .forEach((pathway) => {
          items.push({
            stId: pathway.stId,
            name: pathway.name,
            entities1: undefined,
            entities2: pathway.entities,
          });
        });

      return items;
    },
  },
};
</script>

<style scoped>
.flex {
  justify-content: space-between;
}
</style>