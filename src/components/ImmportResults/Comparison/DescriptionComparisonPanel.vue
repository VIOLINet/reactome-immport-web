<template>
  <v-card outlined>
    <v-card-title class="flex">
      <h4>Descriptions</h4>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <h2>{{compareFrom.resultSetName}} (a)</h2>
            <ResultsDescription :formData="compareFrom" />
          </v-col>
          <v-col cols="12" md="6">
            <h2>{{compareTo.resultSetName}} (b)</h2>
            <ResultsDescription :formData="compareTo"/>
          </v-col>
        </v-row>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script>
import ResultsDescription from "../Description/ResultsDescription";
export default {
  name: "DescriptionComparisonPanel",
  components: {
    ResultsDescription,
  },
  props: {
    formDatas: {
      type: Array,
      default: () => [],
    },
    compareFrom: {
      type: Object,
      default: () => {}
    },
    compareTo: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    show: false,
  }),
};
</script>

<style scoped>
.flex {
  justify-content: space-between;
}
.grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr min-content;
}
.smaller {
  width: 80%;
}
</style>