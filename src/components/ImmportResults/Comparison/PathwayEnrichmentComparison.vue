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
        <plot
          :pathwayEnrichmentResults1="pathwayEnrichmentOne.pathways"
          :title1="titleOne"
          :pathwayEnrichmentResults2="pathwayEnrichmentTwo.pathways"
          :title2="titleTwo"
        >
        </plot>
        <v-card outlined>
          <v-data-table
            dense
            :headers="pathwayEnrichmentHeaders"
            :items="items"
            :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
            no-results-text="No pathways. Try a less strict filter thresholds."
          >
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
            <template v-slot:item.entitiesFoundRatio="{ item }">
              <p :title="item.entitiesFoundRatio">
                {{
                  item.entitiesFoundRatio &&
                  Math.round((item.entitiesFoundRatio + Number.EPSILON) * 100) /
                    100
                }}
              </p>
            </template>
            <template v-slot:item.logPVal1Over2="{ item }">
              <p :title="item.logPVal1Over2 && item.logPVal1Over2">
                {{
                  item.logPVal1Over2 &&
                  Math.round((item.logPVal1Over2 + Number.EPSILON) * 100) / 100
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
                {{
                  item.logFdr1Over2 &&
                  Math.round((item.logFdr1Over2 + Number.EPSILON) * 100) / 100
                }}
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
        </v-card>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
import ComparisonPathwayPlot from "../VolcanoPlot/ComparisonPathwayPlot.vue";

export default {
  name: "PathwayEnrichmentComparison",
  components: {
    plot: ComparisonPathwayPlot,
  },
  props: {
    pathwayEnrichmentOne: {
      type: Object,
      default: () => {},
    },
    titleOne: {
      type: String,
      default: "Result One",
    },
    pathwayEnrichmentTwo: {
      type: Object,
      default: () => {},
    },
    titleTwo: {
      type: String,
      default: "Result Two",
    },
  },
  data: () => ({
    show: false,
    pathwaySearchInput: "",
    logFDR1FDR2Input: 0,
    logPval1Over2Input: 0,
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
        { text: "Entities Found" + "a".sup(), value: "entities.found" },
        { text: "Entities Found" + "b".sup(), value: "entities2.found" },
        {
          text: "Found" + "a".sup() + " - Found" + "b".sup(),
          value: "entitiesFoundRatio",
          filter: (value) => {
            if (!this.ratioComparisonInput) return true;
            return value > this.ratioComparisonInput;
          },
        },
        {
          text: "pValue" + "a".sup(),
          value: "entities.pValue",
        },
        {
          text: "pValue" + "b".sup(),
          value: "entities2.pValue",
        },
        {
          text: "log(pVal" + "a".sup() + "/pVal" + "b".sup() + ")",
          value: "logPVal1Over2",
          filter: (value) => {
            if (!this.logPval1Over2Input) return true;
            return Math.abs(value) >= this.logPval1Over2Input;
          },
        },
        { text: "FDR" + "a".sup(), value: "entities.fdr" },
        { text: "FDR" + "b".sup(), value: "entities2.fdr" },
        {
          text: "log(FDR" + "a".sup() + "/" + "FDR" + "b".sup() + ")",
          value: "logFdr1Over2",
          filter: (value) => {
            if (!this.logFDR1FDR2Input) return true;
            return Math.abs(value) >= this.logFDR1FDR2Input;
          },
        },
      ];
    },
    items() {
      // We need to make a copy of the object to avoid data modification
      const pathwaysOne = [];
      for (let pathway of this.pathwayEnrichmentOne.pathways)
        pathwaysOne.push(Object.create(pathway));
      const secondaryPathways = new Map();
      this.pathwayEnrichmentTwo.pathways &&
        this.pathwayEnrichmentTwo.pathways.forEach((pw) =>
          secondaryPathways.set(pw.stId, Object.create(pw))
        );

      //loop over primary pathways and add secondary entities if available
      pathwaysOne &&
        pathwaysOne.forEach((pathway) => {
          const secondaryPW = secondaryPathways.get(pathway.stId);
          if (!secondaryPW) return;
          pathway.entities2 = secondaryPW.entities;
          pathway.entitiesFoundRatio =
            (pathway.entities ? pathway.entities.found : 0) -
            (pathway.entities2 ? pathway.entities2.found : 1);
          pathway.logPVal1Over2 = Math.log10(
            (pathway.entities ? pathway.entities.pValue : 0) /
              (pathway.entities2 ? pathway.entities2.pValue : 1)
          );
          pathway.logFdr1Over2 =
            pathway.entities2 &&
            pathway.entities &&
            Math.log10(pathway.entities.fdr / pathway.entities2.fdr);
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