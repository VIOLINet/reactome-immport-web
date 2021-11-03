<template>
  <v-stepper v-model="stepper">
    <v-stepper-header>
      <v-stepper-step
        editable
        :complete="filteredBiosampleMetaData.length > 0"
        step="1"
      >
        Filter Biosamples
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2">Setup Analysis</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <BiosampleFilterForm
          :biosampleMetaData="biosampleMetaData"
          @biosamplesFilteredEvent="biosamplesFilteredEvent"
        />
      </v-stepper-content>
      <v-stepper-content step="2">
        <GeneExpressionOptionsForm
          :biosampleMetaData="filteredBiosampleMetaData"
          :currentResultNames="currentResultNames"
          @backEvent="backEvent"
          @optionsSelectedEvent="optionsSelectedEvent"
        />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import ImmportService from "../../service/ImmportService";
import BiosampleFilterForm from "./BiosampleFilterForm";
import GeneExpressionOptionsForm from "./GeneExpressionOptionsForm";
export default {
  name: "GeneExpressionAnalysisForm",
  components: {
    BiosampleFilterForm,
    GeneExpressionOptionsForm,
  },
  props:{
    currentResultNames: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    stepper: 1,
    biosampleMetaData: [],
    filteredBiosampleMetaData: [],
    studyVariables: {},
    formVariables: {},
    selectedOptions: {},
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
      this.studyVariables = biosampleFilterRtn.studyVariables;
      this.formVariables = biosampleFilterRtn.formVariables;
      this.stepper = 2;
    },
    backEvent() {
      this.stepper = 1;
    },
    optionsSelectedEvent(selectedOptions) {
      this.selectedOptions = selectedOptions;
      var samples = selectedOptions.modelTime
        ? this.filteredBiosampleMetaData
        : this.filteredBiosampleMetaData.filter((sample) =>
            [
              ...selectedOptions.analysisGroups.group1,
              ...selectedOptions.analysisGroups.group2,
            ].includes(parseInt(sample.immport_vaccination_time))
          );
      const data = {};
      data.GSMids = [...new Set(samples.map((sample) => sample.gsm))];
      data.studyCohort = this.studyVariables;
      Object.assign(data, selectedOptions);

      const rtn = {};
      rtn.analysisData = data;
      rtn.formData = {};
      Object.assign(rtn.formData, this.formVariables);
      Object.assign(rtn.formData, selectedOptions);

      this.$emit("analyzeData", rtn);
    },
  },
};
</script>

<style scoped>
</style>