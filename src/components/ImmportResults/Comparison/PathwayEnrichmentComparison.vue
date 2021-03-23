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
          <template v-slot:item.entities.ratio="{ item }">
            <p :title="item.entities && item.entities.ratio">
              {{ item.entities && item.entities.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities2.ratio="{ item }">
            <p :title="item.entities2 && item.entities2.ratio">
              {{ item.entities2 && item.entities2.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities.pValue="{ item }">
            <p :title="item.entities && item.entities.pValue">
              {{ item.entities && item.entities.pValue.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities2.pValue="{ item }">
            <p :title="item.entities2 && item.entities2.pValue">
              {{ item.entities2 && item.entities2.pValue.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entitiesRatioDiff="{item}">
            <p :title="item.entitiesRatioDiff">
              {{ item.entitiesRatioDiff && item.entitiesRatioDiff.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities.fdr="{ item }">
            <p :title="item.entities && item.entities.fdr">
              {{ item.entities && item.entities.fdr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities2.fdr="{ item }">
            <p :title="item.entities2 && item.entities2.fdr">
              {{ item.entities2 && item.entities2.fdr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.logFdr1Over2="{item}">
            <p :title="item.logFdr1Over2">
              {{ item.logFdr1Over2 && Math.round((item.logFdr1Over2 + Number.EPSILON) * 100) / 100 }}
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
        { text: "Entities Found" + "1".sup(), value: "entities.found" },
        { text: "Entities Found" + "2".sup(), value: "entities2.found" },
        { text: "Δ Entities Found", value: "entitiesFoundDiff"},
        { text: "Entities Ratio" + "1".sup(), value: "entities.ratio" },
        { text: "Entities Ratio" + "2".sup(), value: "entities2.ratio" },
        { text: "Δ Entites Ratio", value: "entitiesRatioDiff"},
        { text: "FDR" + "1".sup(), value: "entities.fdr" },
        { text: "FDR" + "2".sup(), value: "entities2.fdr" },
        {text: "log(FDR" +"1".sub() + "/"+"FDR" + "2".sub() +")", value: "logFdr1Over2"}
      ];
    },
    items() {
      const pathwaysOne = [...this.pathwayEnrichmentOne.pathways];
      const secondaryPathways = new Map();
       this.pathwayEnrichmentTwo.pathways && this.pathwayEnrichmentTwo.pathways.forEach(pw => secondaryPathways.set(pw.stId, pw))

      //loop over primary pathways and add secondary entities if available
      pathwaysOne && pathwaysOne.forEach((pathway) => {
        const secondaryPW = {...secondaryPathways.get(pathway.stId)}
        if(!secondaryPW) return;
        pathway.entities2 = secondaryPW.entities;
        pathway.entitiesFoundDiff = (pathway.entities2 ? pathway.entities2.found : 0) - (pathway.entities ? pathway.entities.found:0)
        pathway.entitiesRatioDiff = (pathway.entities2 ? pathway.entities2.ratio : 0) - (pathway.entities ? pathway.entities.ratio : 0)
        pathway.logFdr1Over2 = (pathway.entities2 && pathway.entities) && Math.log(pathway.entities.fdr / pathway.entities2.fdr)
        secondaryPathways.delete(pathway.stId);
      });

      //add secondary pathways not part of primary pathways
      secondaryPathways && secondaryPathways.forEach((value) => {
        value.entities2 = value.entities
        delete value.entities
      })
      pathwaysOne.push(...secondaryPathways.values())
      return pathwaysOne;
    },
  },
};
</script>

<style scoped>
.flex {
  justify-content: space-between;
}
</style>