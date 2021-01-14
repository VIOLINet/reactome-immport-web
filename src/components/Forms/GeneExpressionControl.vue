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
      :biosampleMetaData="filteredBiosampleMetaData"
      @backEvent="backEvent"
      @optionsSelectedEvent="optionsSelectedEvent"/>
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
    studyVariables: {},
    formVariables: {},
    selectedOptions: {}
  }),
  async created() {
    try {
      this.biosampleMetaData = await ImmportService.fetchBiosampleMetadata();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    biosamplesFilteredEvent(biosampleFilterRtn) {
      this.filteredBiosampleMetaData = biosampleFilterRtn.filteredBiosamples;
      this.studyVariables = biosampleFilterRtn.studyVariables
      this.formVariables = biosampleFilterRtn.formVariables
    },
    backEvent(){
      this.filteredBiosampleMetaData = [];
    },
    optionsSelectedEvent(selectedOptions) {
      this.selectedOptions = selectedOptions

      const data = {};
      data.GSMids = [...new Set(this.filteredBiosampleMetaData.map(sample => sample.gsm))];
      data.studyVariables = this.studyVariables;
      Object.assign(data, selectedOptions);

      const rtn = {}
      rtn.analysisData = data;
      rtn.formData = {}
      Object.assign(rtn.formData, this.formVariables)
      Object.assign(rtn.formData, selectedOptions);

      this.$emit('analyzeData', rtn);

      this.backEvent();
    }
  },
};
</script>

<style scoped>
</style>