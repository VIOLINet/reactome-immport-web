<template>
  <v-card outlined>
      <v-card-title>
          Gene List
          <v-spacer></v-spacer>
          <v-btn icon @click="show = !show">
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
      </v-card-title>
  </v-card>
</template>

<script>
export default {
    name: "GeneList",
    props: {
        GeneExpressionAnalysis
    }
}
</script>

<style scoped>

</style>