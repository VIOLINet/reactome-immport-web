<template>
  <v-card outlined>
    <v-card-title class="flex">
      <div style="max-width:80%;">
        <div>
          <p class="mb-0 panel-name" :title="resultSet.formData.resultSetName">{{ resultSet.formData.resultSetName }}</p>
        </div>
        <p class="small">
          {{ resultSet.formData.selectedVaccines.join(", ") }}
        </p>
      </div>
      <div>
        <v-btn
        v-if="showComparisonButton"
          color="primary"
          class="ma-1"
          @click="$emit('compareResults', resultSet.id)"
          >Compare Results</v-btn
        >
        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
        <v-btn icon @click="closeResults"
          ><v-icon>{{ "mdi-close" }}</v-icon></v-btn
        >
      </div>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <ResultsDescriptionPanel class="mb-5" :formData="resultSet.formData" />
        <GeneExpressionResults
          :geneExpressionResults="resultSet.geneExpressionResults"
          @doPathwayEnrichmentAnalysis="fetchPathwayEnrichmentAnalysis"
          @doFINetworkAnalysis="fetchNetworkAnalysis"
        />
        <PathwayEnrichmentResults
          class="mt-5"
          :id="resultSet.id + 'pathwayEnrichment'"
          v-if="resultSet.enrichmentResults.pathways"
          :pathwayEnrichmentResults="resultSet.enrichmentResults"
        />
        <CyInstance
          class="mt-5"
          :id="resultSet.id + 'fiNetwork'"
          v-if="resultSet.fiNetwork.network.length > 0"
          :cyElementsProp="resultSet.fiNetwork.network"
          :filterProps="{
            absLogFC: resultSet.fiNetwork.absLogFC,
            adjPValue: resultSet.fiNetwork.adjPValue,
          }"
          @updateTotalNodes="updateTotalNodes"
        />
      </v-card-text>
    </v-expand-transition>
    <slot :name="resultSet.id"></slot>
  </v-card>
</template>

<script>
import CyInstance from "./Cytoscape/CyInstance";
import ResultsDescriptionPanel from "./Description/ResultsDescriptionPanel";
import GeneExpressionResults from "./GeneExpressionResults";
import PathwayEnrichmentResults from "./PathwayEnrichmentResults";
import _isEqual from "lodash/isEqual";
export default {
  name: "GeneExpResults",
  components: {
    CyInstance,
    ResultsDescriptionPanel,
    GeneExpressionResults,
    PathwayEnrichmentResults,
  },
  props: {
    resultSet: {
      type: Object,
      default: () => {},
    },
    showComparisonButton: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    show: true,
  }),
  watch: {
    "resultSet.enrichmentResults": {
      handler(newVal, oldVal) {
        newVal.pathways &&
          (!oldVal || !_isEqual(newVal, oldVal)) &&
          setTimeout(() => {
            document
              .getElementById(this.resultSet.id + "pathwayEnrichment")
              .scrollIntoView();
          }, 250);
      },
      deep: true,
    },
    "resultSet.fiNetwork": {
      handler(newVal, oldVal) {
        newVal &&
          (!oldVal || !_isEqual(newVal, oldVal)) &&
          setTimeout(() => {
            document
              .getElementById(this.resultSet.id + "fiNetwork")
              .scrollIntoView();
          }, 250);
      },
    },
    editTextInput(val) {
      if (val.length > 10) this.editTextInput = this.editTextInput.slice(0, -1);
    },
  },
  computed: {
    showEnrichmentResults() {
      const obj = this.resultSet.enrichmentResults;
      return obj && obj.pathways ? true : false;
    },
  },
  methods: {
    fetchPathwayEnrichmentAnalysis(genes) {
      this.$emit("fetchPathwayEnrichmentAnalysis", this.resultSet.id, genes);
    },
    fetchNetworkAnalysis(props) {
      this.$emit("fetchNetworkAnalysis", this.resultSet.id, props);
    },
    updateTotalNodes({ totalNodes, absLogFC, adjPValue }) {
      //get initial set of genes based on absLogFC and adjPValue
      const genes = this.resultSet.geneExpressionResults
        .filter(
          (result) =>
            result.adjPValue <= adjPValue && Math.abs(result.logFC) >= absLogFC
        )
        .sort((a, b) => {
          a.adjPValue <= b.adjPValue;
        })

      //check to ensure the filter isn't larger than totalNodes
      if (genes.length > totalNodes) {
        this.$emit("fetchNetworkAnalysis", this.resultSet.id, {
          absLogFC: absLogFC,
          adjPValue: adjPValue,
          genes: genes.slice(0, totalNodes < 225 ? totalNodes : 225),
        });
        return;
      }

      //if less genes than totalNodes, need to increase by sorted list of genes
      //1. filter out all genes already existing in genes variable
      //2. sort genes by adjPValue
      //3. slice to remainder of space up to totalGenes
      //4. map to gene name
      const extraGenes = this.resultSet.geneExpressionResults
        .filter((gene) => 
          !genes.map(gene => gene.gene_name).includes(gene.gene_name)
        )
        .sort((a, b) => {
          a.adjPValue <= b.adjPValue;
        })
        .slice(0, totalNodes - genes.length)

      genes.push(...extraGenes);

      this.$emit("fetchNetworkAnalysis", this.resultSet.id, {
          absLogFC: Math.min(...genes.map(gene => Math.abs(gene.logFC))),
          adjPValue: Math.max(...genes.map(gene => gene.adjPValue)),
          genes
        });
    },
    closeResults() {
      this.$emit("closeResults", this.resultSet.id);
    },
  },
};
</script>

<style scoped>
td {
  outline: none;
  border: none;
}
.flex {
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 8px 16px;
}
.small {
  text-align: left;
  font-size: small;
}
.panel-name {
  display: inline-block;
  white-space: nowrap;
  overflow:hidden;
  width:100%;
  text-overflow:ellipsis;
  }
</style>