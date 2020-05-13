<template>
  <v-container fluid>
    <p class="title">Result Sets:</p>
    <v-card outlined>
      <ResultListItem v-for="result in resultSets" :key="result.id" :data = "result"/>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import {v4 as uudiv4} from "uuid";
import ResultListItem from './ResultListItem';
export default {
  name: "ResultList",
  components: {
    ResultListItem
  },
  props: {
    formSubmissions: { type: Array, default: () => [] }
  },
  data: () => ({
    resultSets: []
  }),
  watch: {
    formSubmissions: function(newVal, oldVal)  {
      if(oldVal.length >= newVal) return; //method fires when formSubmissions has an item removed too. dont want to load new data in this case
      this.loadData(newVal[newVal.length -1])
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
          this.resultSets.push(returnData);
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