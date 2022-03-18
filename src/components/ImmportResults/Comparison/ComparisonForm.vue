<template light>
  <v-card light outlined class="full-width">
      <v-card-text>
      <p class="text-left from-text">Compare from: <strong>{{this.resultSets.find(rs => rs.id === this.compareFromId).formData.resultSetName}}</strong></p>
      <v-select :items="compareToNames" item-text="title" item-value="id" label="Comparison Options" v-model="selectedId"></v-select>
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
        compareToNames() {
            return this.resultSets.filter(rs => rs.id !== this.compareFromId).map(rs => ({title: `${rs.formData.resultSetName}`,
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
.full-width {
    width: 600px;
}
.from-text {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>