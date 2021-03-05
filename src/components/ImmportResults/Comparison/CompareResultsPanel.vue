<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div>
        <p class="mb-0">
          Comparing Results {{ compareFrom.displayId }} &
          {{ compareTo.displayId }}
        </p>
      </div>
      <div>
        <v-btn icon @click="closeComparison"
          ><v-icon>{{ "mdi-close" }}</v-icon></v-btn
        >
      </div>
    </v-card-title>
    <v-card-text>
      <DescriptionComparisonPanel
        class="mb-5"
        :formDatas="[compareFrom.formData, compareTo.formData]"
      />
      <GeneExpressionComparison 
        :geneExpressionOne="compareFrom.geneExpressionResults"
        :geneExpressionTwo="compareTo.geneExpressionResults"
      />
      <PathwayEnrichmentComparison 
      class="mt-5"
      :pathwayEnrichmentOne="compareFrom.enrichmentResults"
      :pathwayEnrichmentTwo="compareTo.enrichmentResults"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DescriptionComparisonPanel from "./DescriptionComparisonPanel";
import GeneExpressionComparison from "./GeneExpressionComparison";
import PathwayEnrichmentComparison from './PathwayEnrichmentComparison';
export default {
  name: "CompareResultsPanel",
  components: {
    DescriptionComparisonPanel,
    GeneExpressionComparison,
    PathwayEnrichmentComparison
  },
  props: {
    compareFrom: {
      type: Object,
      default: () => {},
    },
    compareTo: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    closeComparison() {
      this.$emit("closeComparison", [this.compareFrom.id, this.compareTo.id]);
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
</style>