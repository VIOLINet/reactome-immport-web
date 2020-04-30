<template>
      <v-container fluid class="wrapper">
          <v-tabs :centered="true">
              <v-tab>Reactome Enrichment Analysis</v-tab>
              <v-tab-item>
                  <v-card tile>
                      <v-card-text>
                          TEST
                      </v-card-text>
                  </v-card>
              </v-tab-item>
              <v-tab>Functional Interactions</v-tab>
              <v-tab-item>TEST2</v-tab-item>
          </v-tabs>
      </v-container>
</template>

<script>
export default {
    name: "ResultsPanel",
   props: {
       analysisData: {
           type: Object,
           default: () => {}
       },
       fiData: {
           type: Object,
           default: () => {}
       }
   }
}
</script>

<style scoped>
.wrapper {
    width: 90%;
}
</style>