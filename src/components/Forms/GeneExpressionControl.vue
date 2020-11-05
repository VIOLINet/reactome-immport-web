<template>
  <v-card outlined>
    <v-card-title>Gene Expression Analysis</v-card-title>
    <BiosampleFilterForm
      :biosampleMetaData="biosampleMetaData"
      @biosamplesFilteredEvent="biosamplesFilteredEvent"
      v-if="filteredBiosampleMetaData.length === 0"
    />
    <GeneExpressionOptionsForm 
      v-if="filteredBiosampleMetaData.length > 0"
      :biosampleMetaData="biosampleMetaData"
      @backEvent="backEvent"/>
  </v-card>
</template>

<script>
import ImmportService from "../../service/ImmportService";
import BiosampleFilterForm from "./BiosampleFilterForm";
import GeneExpressionOptionsForm from "./GeneExpressionOptionsForm";
export default {
  name: "GeneExpressionControl",
  components: {
    BiosampleFilterForm,
    GeneExpressionOptionsForm
  },
  data: () => ({
    biosampleMetaData: [],
    filteredBiosampleMetaData: [],
  }),
  async created() {
    try {
      this.biosampleMetaData = await ImmportService.fetchBiosampleMetadata();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    biosamplesFilteredEvent(filterdBiosamples) {
      this.filteredBiosampleMetaData = filterdBiosamples;
    },
    backEvent(){
      this.filteredBiosampleMetaData = [];
    }
  },
};
</script>

<style scoped>
</style>