<template>
  <v-sheet color="grey lighten-2">
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedVaccines.join(', ')"><b>Vaccines:</b> {{formData.selectedVaccines.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedStudies.join(', ')"><b>Studies:</b> {{formData.selectedStudies.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedPlatforms.join(', ')"><b>Platform Descriptions:</b> {{formData.selectedPlatforms.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedDayDefinitions.join(', ')"><b>Day 0 Definitions:</b> {{formData.selectedDayDefinitions.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedGenders.join(', ')"><b>Genders:</b> {{formData.selectedGenders.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedAges.join(', ')"><b>Ages:</b> {{formData.selectedAges.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.selectedRaces.join(', ')"><b>Race:</b> {{formData.selectedRaces.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.studyVariables.length > 0 ?formData.studyVariables.join(', ') : 'None'"><b>Study Variables:</b> {{formData.studyVariables.length > 0 ?formData.studyVariables.join(", ") : "None"}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.platformCorrection === true ? 'Yes' : 'No'"><b>Platform Correction:</b> {{formData.platformCorrection === true ? "Yes" : "No"}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title :title="formData.modelTime === true ? 'Yes' : 'No'"><b>Use time directly in the model?</b> {{formData.modelTime === true ? "Yes" : "No"}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-sheet>
</template>

<script>
export default {
    name: "ResultsDescription",
    props: {
        formData: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style scoped>

</style>