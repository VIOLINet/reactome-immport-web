<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        {{this.panelName}}
        <v-subheader>{{this.subHeader}}</v-subheader>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('openComparison')" v-show="showCompareButton">Compare!</v-btn>
        <v-btn icon @click="expandCard = !expandCard">
          <v-icon>{{ expandCard ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('removeResultSet', result.id)">
          <v-icon>{{ 'mdi-close' }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <div v-show="expandCard" class="pa-1">
          <v-tabs :centered="true">
            <v-tab>Reactome Enrichment Analysis</v-tab>
            <v-tab-item>
              <v-data-table
                dense
                :headers="analysisHeaders"
                :items="filteredItems"
                :search="search"
                :footer-props="{'items-per-page-options': [20,40,50,100,-1]}"
              >
                <template v-slot:item.name="{item}">
                  <a
                    :href="`https://dev.reactome.org/PathwayBrowser/#/${item.stId}&DTAB=AN&ANALYSIS=${result.analysisData.summary.token}`"
                    target="_blank"
                    title="View Analyzed Pathway in Reactome"
                  >{{item.name}}</a>
                </template>

                <template v-slot:item.entities.found="{item}">{{item.entities.found}}</template>
                <template v-slot:item.entities.total="{item}">{{item.entities.total}}</template>

                <template
                  v-slot:item.entities.ratio="{item}"
                >{{item.entities.ratio.toExponential(2)}}</template>
                <template
                  v-slot:item.entities.pValue="{item}"
                >{{item.entities.pValue.toExponential(2)}}</template>
                <template v-slot:item.entities.fdr="{item}">{{item.entities.fdr.toExponential(2)}}</template>
                <template v-slot:footer="{}">
                  <a
                    :href="`https://dev.reactome.org/PathwayBrowser/#/DTAB=AN&ANALYSIS=${result.analysisData.summary.token}`"
                    target="_blank"
                  >
                    <img
                      :src="'/static/images/reactome_icon.png'"
                      alt="Reactome Icon"
                      class="smallIcon"
                      title="View Detailed Results in Reactome"
                    />
                  </a>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    label="Search"
                    hide-details
                    single-line
                    class="search-box pr-1"
                  ></v-text-field>
                  <v-text-field prefix="pValue ≤" v-model="pValFilter" hide-details single-line class="search-box pr-1"></v-text-field>
                  <v-text-field prefix="FDR ≤" v-model="fdrFilter" hide-details single-line class="search-box pr-1"></v-text-field>
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab>Functional Interactions</v-tab>
            <v-tab-item>
              <CyInstance :cyElementsProp="result.fiData"/>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script>
import CyInstance from "./CyInstance"
export default {
  name: "ResultListItem",
  components: {
    CyInstance
  },
  props: {
    result: {
      type: Object,
      default: () => {}
    },
    showCompareButton: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    expandCard: true,
    search: "",
    pValFilter: 1,
    fdrFilter: 1,
    analysisHeaders: [
      { text: "Pathway Name", value: "name" },
      { text: "Entities Found", value: "entities.found" },
      { text: "Entities Total", value: "entities.total" },
      { text: "Entities Ratio", value: "entities.ratio" },
      { text: "Entities pValue", value: "entities.pValue" },
      { text: "Entities FDR", value: "entities.fdr" }
    ],
  }),
  computed: {
    panelName() {
      return `Result ${this.result.id}: ${this.result.properties.voIds.map(({ name }) => name).join(", ")}`;
    },
    subHeader() {
      return (
        this.result.properties.genderList.join(", ") +
        "; " +
        this.result.properties.times.join(", ")
      );
    },
    filteredItems(){
      return this.result.analysisData.pathways.filter(i => {
        return i.entities.pValue <= this.pValFilter && i.entities.fdr <= this.fdrFilter
      })
    }
  },

};
</script>

<style scoped>
.smallIcon {
  max-width: 2em;
  float: left;
  margin: 0.5em;
}
.search-box {
  float: left;
  max-width: 25em;
}

</style>