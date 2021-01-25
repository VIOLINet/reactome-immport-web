<template>
  <v-card outlined>
      <v-card-title>
          <h4>Description</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
      </v-card-title>
      <v-expand-transition>
          <v-card-text v-show="show">
              <ResultsDescription :formData="formData"/>
          </v-card-text>
      </v-expand-transition>
  </v-card>
</template>

<script>
import ResultsDescription from './ResultsDescription'
export default {
    name: "ResultsDescriptionPanel",
    components: {
        ResultsDescription
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        show: false,
    })
}
</script>

<style scoped>

</style>