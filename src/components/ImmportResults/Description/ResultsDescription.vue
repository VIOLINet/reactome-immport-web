<template>
  <v-sheet color="grey lighten-2 ma-3">
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Vaccines:</b> {{formData.selectedVaccines.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Studies:</b> {{formData.selectedStudies.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Platform Descriptions:</b> {{formData.selectedPlatforms.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Day 0 Definitions:</b> {{formData.selectedDayDefinitions.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Genders:</b> {{formData.selectedGenders.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Ages:</b> {{formData.selectedAges.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Race:</b> {{formData.selectedRaces.join(", ")}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Adjusting Variables:</b> {{formData.adjustingVariables.length > 0 ?formData.adjustingVariables.join(", ") : "None"}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Platform Correction:</b> {{formData.platformCorrection == true ? "Yes" : "No"}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item dense class="text-left">
      <v-list-item-content>
        <v-list-item-title><b>Use time directly in the model?</b> {{formData.modelTimes == true ? "Yes" : "No"}}</v-list-item-title>
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