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
          <template v-slot:item.logPVal1Over2="{ item }">
            <p :title="item.logPVal1Over2 && item.logPVal1Over2">
              {{ item.logPVal1Over2 && item.logPVal1Over2.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entitiesRatioDiff="{ item }">
            <p :title="item.entitiesRatioDiff">
              {{
                item.entitiesRatioDiff &&
                item.entitiesRatioDiff.toExponential(2)
              }}
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
          <template v-slot:item.logFdr1Over2="{ item }">
            <p :title="item.logFdr1Over2">
              {{ item.logFdr1Over2 && item.logFdr1Over2.toExponential(2) }}
            </p>
          </template>
          <template v-slot:body.append>
            <tr>
              <td colspan="1"></td>
              <td>
                <v-text-field
                  placeholder="Search name"
                  v-model="pathwaySearchInput"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="2"></td>
              <td colspan="1">
                <v-text-field
                  prefix="abs(Δ)≥"
                  v-model="ratioComparisonInput"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="2"></td>
              <td>
                <v-text-field
                  prefix="abs()≥"
                  v-model="logPval1Over2Input"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="2"></td>
              <td colspan="1">
                <v-text-field
                  prefix="abs()≥"
                  v-model="logFDR1FDR2Input"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
            </tr>
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
    pathwaySearchInput: "",
    logFDR1FDR2Input: 0,
    logPval1Over2Input: 0,
    pValue1Input: 1,
    pValue2Input: 1,
    ratioComparisonInput: 0,
  }),
  computed: {
    pathwayEnrichmentHeaders() {
      return [
        { text: "Stable Identifier", value: "stId" },
        {
          text: "Pahtway Name",
          value: "name",
          filter: (value) => {
            if (!this.pathwaySearchInput) return true;
            return value.includes(this.pathwaySearchInput);
          },
        },
        { text: "Entities Ratio" + "1".sup(), value: "entities.ratio" },
        { text: "Entities Ratio" + "2".sup(), value: "entities2.ratio" },
        {
          text: "Ratio" + "1".sup() + "/ Ratio" + "2".sup(),
          value: "entitiesRatioDiff",
          filter: (value) => {
            if (!this.ratioComparisonInput) return true;
            return value > this.ratioComparisonInput;
          },
        },
        {
          text: "pValue" + "1".sup(),
          value: "entities.pValue",
          filter: (value) => {
            if (!this.pValue1Input) return true;
            return value <= this.pValue1Input;
          },
        },
        {
          text: "pValue" + "2".sup(),
          value: "entities2.pValue",
          filter: (value) => {
            if (!this.pValue2Input) return true;
            return value <= this.pValue2Input;
          },
        },
        {
          text: "log(pVal" + "1".sup() + "/pVal" + "2".sup() + ")",
          value: "logPVal1Over2",
          filter: (value) => {
            if (!this.logPval1Over2Input) return true;
            return Math.abs(value) >= this.logPval1Over2Input;
          },
        },
        { text: "FDR" + "1".sup(), value: "entities.fdr" },
        { text: "FDR" + "2".sup(), value: "entities2.fdr" },
        {
          text: "log(FDR" + "1".sup() + "/" + "FDR" + "2".sup() + ")",
          value: "logFdr1Over2",
          filter: (value) => {
            if (!this.logFDR1FDR2Input) return true;
            return Math.abs(value) >= this.logFDR1FDR2Input;
          },
        },
      ];
    },
    items() {
      const pathwaysOne = [...this.pathwayEnrichmentOne.pathways];
      const secondaryPathways = new Map();
      this.pathwayEnrichmentTwo.pathways &&
        this.pathwayEnrichmentTwo.pathways.forEach((pw) =>
          secondaryPathways.set(pw.stId, pw)
        );

      //loop over primary pathways and add secondary entities if available
      pathwaysOne &&
        pathwaysOne.forEach((pathway) => {
          const secondaryPW = { ...secondaryPathways.get(pathway.stId) };
          if (!secondaryPW) return;
          pathway.entities2 = secondaryPW.entities;
          pathway.entitiesRatioDiff =
            (pathway.entities2 ? pathway.entities2.ratio : 0) /
            (pathway.entities ? pathway.entities.ratio : 1);
          pathway.logPVal1Over2 = Math.log(
            (pathway.entities ? pathway.entities.pValue : 0) /
              (pathway.entities2 ? pathway.entities2.pValue : 1)
          );
          pathway.logFdr1Over2 =
            pathway.entities2 &&
            pathway.entities &&
            Math.log(pathway.entities.fdr / pathway.entities2.fdr);
          secondaryPathways.delete(pathway.stId);
        });

      //add secondary pathways not part of primary pathways
      secondaryPathways &&
        secondaryPathways.forEach((value) => {
          value.entities2 = value.entities;
          delete value.entities;
        });
      pathwaysOne.push(...secondaryPathways.values());
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