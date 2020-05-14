<template>
  <v-container fluid>
    <p class="title">Result Sets:</p>
      <ResultListItem v-for="result in results" :key="result.id" :result="result" />
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
    formSubmissions: function(newVal, oldVal) {
      if (oldVal.length >= newVal) return; //method fires when formSubmissions has an item removed too. dont want to load new data in this case
      this.loadData(newVal[newVal.length - 1]);
    }
  },
  created() {
    this.loadData(this.formSubmissions[0]);
  },
  methods: {
    loadData(postData) {
      //do somthing with post data to avoid error while still making testin get requests for fake data
      if (!postData) return;

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
          this.results.push(returnData);
          this.dataLoaded = true;
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
</style>