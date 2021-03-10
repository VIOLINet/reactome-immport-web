<template>
  <v-card outlined class="ma-5">
      <v-card-text>
      <p class="text-left">Compare from: <strong>{{compareFromName}}</strong></p>
      <v-select :items="compareToNames" item-text="title" item-value="id" label="Comarison Options" v-model="selectedId"></v-select>
      <div class="flex">
          <v-btn small color="secondary" @click="$emit('cancelComparison')">Cancel</v-btn>
        <v-btn color="primary" @click="selectedId !== null && $emit('addComparison', {compareFrom: compareFromId, compareTo: selectedId})">Compare!</v-btn>
      </div>
      </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: "ComparisonForm",
    props: {
        resultSets: {
            type: Array,
            default: () => []
        },
        compareFromId: {
            type: String,
            default: () => undefined
        },
    },
    data: () => ({
        selectedId: null
    }),
    computed: {
        compareFromName() {
            return "Result Set " + this.resultSets.find(rs => rs.id === this.compareFromId).displayId
        },
        compareToNames() {
            return this.resultSets.filter(rs => rs.id !== this.compareFromId).map(rs => ({title: `Result Set ${rs.displayId}`,
            id: rs.id}))
        }
    }
}
</script>

<style scoped>
.flex {
    display:flex;
    justify-content: flex-end;
    align-items: center;
}
.flex * {
    margin-left: 10px;
}
</style>