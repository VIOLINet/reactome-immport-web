<template>
  <v-container fluid>
    <p class="title">Result Sets:</p>
      <ResultListItem v-for="result in results" :key="result.id" :result="result" @removeResultSet="removeResultSet"/>
  </v-container>
</template>

<script>
import axios from "axios";
import { v4 as uudiv4 } from "uuid";
import ResultListItem from "./ResultListItem";
export default {
  name: "ResultList",
  components: {
    ResultListItem
  },
  props: {
    formSubmissions: { type: Array, default: () => [] }
  },
  data: () => ({
    results: [],
    dataLoaded: false
  }),
  watch: {
    formSubmissions() {
      this.formSubmissions.forEach(x => {
        if(!(this.results.some(result => result.properties.voIds === x.voIds && result.properties.genderList === x.genderList && result.properties.selectedTimes === x.selectedTimes)))
          this.loadData(x)
      })
    }
  },
  created() {
    this.loadData(this.formSubmissions[0]);
  },
  methods: {
    loadData(postData) {
      //make sure post data is not null and that there is no result with a properties ovjeect equal to postData
      if (!postData && !(this.results.some(x => x.properties === postData))) return;

      //eventually axios call will be a post call with the post data. when this happens, we will get the same response as making these
      //test calls but with real data
      var returnData = {};
      returnData.id = uudiv4();
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
        })
        .catch(error => {
          console.error(error);
        });
    },
    removeResultSet(key){
      const index = this.results.findIndex(x => x.id === key)
      const properties = this.results[index].properties
      this.results.splice(index, 1)
      this.$emit('removeFormSubmission', properties)
    }
  }
};
</script>

<style scoped>
</style>