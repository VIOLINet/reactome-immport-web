<template>
  <v-card outlined>
    <v-card-title>
      <h4>Pathway Enrichment Analysis</h4>
      <v-spacer></v-spacer>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <v-data-table
          dense
          :headers="pathwayEnrichmentHeaders"
          :items="pathwayEnrichmentResults.pathways"
          :footer-props="{ 'items-per-page-options': [20, 40, 50, 100] }"
        >
          <template v-slot:item.entities.ratio="{ item }">
            <p :title="item.entities.ratio">
              {{ item.entities.ratio.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.entities.pValue="{ item }"
            ><p :title="item.entities.pValue">
              {{ item.entities.pValue.toExponential(2) }}
            </p></template
          >
          <template v-slot:item.entities.fdr="{ item }"
            ><p :title="item.entities.fdr">
              {{ item.entities.fdr.toExponential(2) }}
            </p></template
          >
          <template v-slot:body.append>
            <tr>
              <td colspan="6"></td>
              <td colspan="1">
                <v-text-field
                  prefix="pVal ≤"
                  v-model="pathwayEnrichmentFDR"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  hide-details=""
                  class="mb-3"
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
  name: "PathwayEnrichmentResults",
  props: {
    pathwayEnrichmentResults: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    show: true,
    pathwayEnrichmentFDR: 1,
  }),
  computed: {
    pathwayEnrichmentHeaders() {
      return [
        { text: "Stable Identifier", value: "stId" },
        { text: "Pathway Name", value: "name" },
        { text: "Entities Found", value: "entities.found" },
        { text: "Entities Total", value: "entities.total" },
        { text: "Entities Ratio", value: "entities.ratio" },
        { text: "Entities pValue", value: "entities.pValue" },
        {
          text: "Entities FDR",
          value: "entities.fdr",
          filter: (value) => {
            if (!this.pathwayEnrichmentFDR) return true;
            return value <= parseFloat(this.pathwayEnrichmentFDR);
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
</style>