<template>
  <v-container fluid>
    <v-dialog v-model="showComparisonForm" max-width="50%">
      <v-card outlined>
        <v-card-text>
          <p>Select Results to compare</p>
          <v-row>
            <v-col cols="12">
              <v-select :items="items" item-text="name" item-value="id" v-model="compareFrom"></v-select>
            </v-col>
            <v-col cols="12">
              <v-select :items="compareItems" item-text="name" item-value="id" v-model="compareTo"></v-select>
            </v-col>
          </v-row>
          <span
            style="color:red; text-align:left;"
            v-for="(message, index) in errorMessages"
            :key="index"
          >{{message}}</span>
          <br />
          <v-btn @click="addComparison">Add</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container fluid v-if="comparisons.length > 0">
      <v-container class="pa-0"><p class="display-1 text-left">Compare results</p></v-container>
      <ComparisonListItem
        v-for="comparison in comparisons"
        :key="comparison.id"
        :comparison="comparison"
        @removeComparison="removeComparison"
      />
      <hr class="mt-5" />
    </v-container>
    <v-container class="mt-5 pa-0">
      <p class="display-1 text-left">Result Sets</p>
    </v-container>
    <v-container v-show="loading">
      <v-card outlined class="pa-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card>
    </v-container>
    <ResultListItem
      v-for="result in results"
      :key="result.id"
      :result="result"
      :showCompareButton="showCompareButton"
      @removeResultSet="removeResultSet"
      @openComparison="setShowComparisonForm"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import { v4 as uudiv4 } from "uuid";
import ResultListItem from "./ResultListItem";
import ComparisonListItem from "./ComparisonListItem";
export default {
  name: "ResultList",
  components: {
    ResultListItem,
    ComparisonListItem
  },
  props: {
    formSubmissions: { type: Array, default: () => [] }
  },
  data: () => ({
    results: [],
    dataLoaded: false,
    showComparisonForm: false,
    compareFrom: "",
    compareTo: "",
    comparisons: [],
    loading: false,
    errorMessages: []
  }),
  computed: {
    items() {
      var items = [];
      this.results.forEach(result => {
        items.push({
          id: result.id,
          name: result.properties.voIds.map(({ name }) => name).join(", ")
        });
      });
      return items;
    },
    compareItems() {
      var items = [];
      this.results.forEach(result => {
        if (result.id === this.compareFrom) return;
        items.push({
          id: result.id,
          name: result.properties.voIds.map(({ name }) => name).join(", ")
        });
      });
      return items;
    },
    showCompareButton() {
      return this.results.length > 1;
    }
  },
  watch: {
    formSubmissions() {
      this.formSubmissions.forEach(x => {
        if (
          !this.results.some(
            result =>
              result.properties.voIds === x.voIds &&
              result.properties.genderList === x.genderList &&
              result.properties.selectedTimes === x.selectedTimes
          )
        )
          this.loadData(x);
      });
    }
  },
  created() {
    this.loadData(this.formSubmissions[0]);
  },
  methods: {
    loadData(postData) {
      //make sure post data is not null and that there is no result with a properties ovjeect equal to postData
      if (!postData && !this.results.some(x => x.properties === postData))
        return;
      this.loading = true;
      //eventually axios call will be a post call with the post data. when this happens, we will get the same response as making these
      //test calls but with real data
      var returnData = {};
      returnData.id = this.results.length+1;
      returnData.properties = postData;
      axios
        .get("http://localhost:8076/immportws/analysis/pathways")
        .then(response => {
          returnData.analysisData = response.data;
          return axios.get(
            "http://localhost:8076/immportws/analysis/fi_network"
          );
        })
        .then(response => {
          returnData.fiData = response.data;
          this.results.unshift(returnData);
          this.dataLoaded = true;
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
          this.loading = false;
        });
    },
    removeResultSet(key) {
      const index = this.results.findIndex(x => x.id === key);
      const properties = this.results[index].properties;
      this.results.splice(index, 1);
      this.$emit("removeFormSubmission", properties);
    },
    removeComparison(comparisonIds) {
      const index = this.comparisons.findIndex(
        x =>
          x.resultSets.includes(comparisonIds[0]) &&
          x.resultSets.includes(comparisonIds[1])
      );
      this.comparisons.splice(index, 1);
    },
    setShowComparisonForm() {
      this.showComparisonForm = true;
    },
    addComparison() {
      if (this.validateComparisonForm()) return;
      const compareFrom = this.results.find(x => x.id === this.compareFrom);
      const compareTo = this.results.find(x => x.id === this.compareTo);
      var comparison = {};
      comparison.id = uudiv4();
      comparison.resultSets = [compareFrom.id, compareTo.id];
      comparison.pathways = this.getComparedPathways(compareFrom, compareTo);
      comparison.fiNetworks = this.getComparedNetworks(
        compareFrom.fiData,
        compareTo.fiData
      );
      this.comparisons.unshift(comparison);
    },
    getComparedPathways(compareFrom, compareTo) {
      var pathways = [];
      var pathwayList = [];
      compareFrom.analysisData.pathways.forEach(pathway => {
        pathways.push(pathway.name);
        var comparePathway = compareTo.analysisData.pathways.find(
          x => x.name === pathway.name
        );
        pathwayList.push(
          this.makeComparisonObject(pathway.name, pathway, comparePathway)
        );
      });
      compareTo.analysisData.pathways.forEach(comparePathway => {
        if (pathways.includes(comparePathway.name)) return;
        pathways.push(comparePathway.name);
        pathwayList.push(
          this.makeComparisonObject(
            comparePathway.name,
            undefined,
            comparePathway
          )
        );
      });
      return pathwayList;
    },
    makeComparisonObject(name, pathway, comparePathway) {
      return {
        name: name,
        sourceEntitiesPValue: pathway ? pathway.entities.pValue : "",
        sourceEntitiesFDR: pathway ? pathway.entities.fdr : "",

        targetEntitiesPValue: comparePathway
          ? comparePathway.entities.pValue
          : "",
        targetEntitiesFDR: comparePathway ? comparePathway.entities.fdr : ""
      };
    },
    getComparedNetworks(compareFrom, compareTo) {
      compareFrom.forEach(edge => {
        if (edge.group !== "edges") return;
        const index = compareTo.findIndex(
          comparedEdge =>
            comparedEdge.data.source === edge.data.source &&
            comparedEdge.data.target === edge.data.target
        );
        if (index !== -1) {
          edge.data.shared = true;
          compareTo[index].data.shared = true;
        }
      });
      return [compareFrom, compareTo];
    },
    validateComparisonForm() {
      this.errorMessages = [];
      var rtn = this.comparisons.some(
        x =>
          x.resultSets.includes(this.compareFrom) &&
          x.resultSets.includes(this.compareTo)
      );
      if (rtn)
        this.errorMessages.push("These two Result sets are already compared.");
      if (!rtn) {
        this.showComparisonForm = false;
      }
      return rtn;
    }
  }
};
</script>

<style scoped>
</style>