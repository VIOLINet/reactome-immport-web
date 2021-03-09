<template>
  <v-card outlined>
    <v-card-title class="flex">
      <h4>Gene Expression Comparison</h4>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <v-data-table dense :headers="geneAnalysisHeaders" :items="items">
          <template
            v-for="(h, index) in geneAnalysisHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <span :key="index" v-html="header.text"></span>
          </template></v-data-table
        ></v-card-text
      ></v-expand-transition
    ></v-card
  >
</template>

<script>
export default {
  name: "GeneExpressionComparison",
  props: {
    geneExpressionOne: {
      type: Array,
      default: () => [],
    },
    geneExpressionTwo: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    geneAnalysisHeaders() {
      return [
        { text: "Gene Name", value: "gene_name" },
        {
          text: "Ave Expr" + "1".sup(),
          value: "AveExpr1",
          filter: (value) => {
            if (!this.aveExpr1Input || value === undefined) return true;
            return value >= this.aveExpr1Input;
          },
        },
        {
          text: "Ave Expr" + "2".sup(),
          value: "AveExpr2",
          filter: (value) => {
            if (!this.aveExpr2Input || value === undefined) return true;
            return value >= this.aveExpr2Input;
          },
        },
        {
          text: "Adj Pval" + "1".sup(),
          value: "adjPValue1",
          filter: (value) => {
            if (!this.adjPVal1Input || value === undefined) return true;
            return value <= this.adjPVal1Input;
          },
        },
        {
          text: "Adj Pval" + "2".sup(),
          value: "adjPValue2",
          filter: (value) => {
            if (!this.adjPVal2Input || value === undefined) return true;
            return value <= this.adjPVal2Input;
          },
        },
        {
          text: "LogFC" + "1".sup(),
          value: "logFC1",
          filter: (value) => {
            if (!this.logFC1Input || value === undefined) return true;
            return Math.abs(value) >= this.absLogFC1Input;
          },
        },
        {
          text: "LogFC" + "2".sup(),
          value: "logFC2",
          filter: (value) => {
            if (!this.logFC2Input || value === undefined) return true;
            return Math.abs(value) >= this.absLogFC2Input;
          },
        },
      ];
    },
    items() {
      const items = [];
      const secondaryGenes = this.geneExpressionTwo
      //loop over initial set and add each
      this.geneExpressionOne.forEach((row) => {
        const compItem = secondaryGenes.find(
          (item) => row.gene_name === item.gene_name
        );
        if(compItem) secondaryGenes.filter(gene => gene.gene_name !== row.gene_name)

        items.push({
          gene_name: row.gene_name,
          AveExpr1: row.AveExpr,
          AveExpr2: compItem ? compItem.AveExpr : undefined,
          adjPValue1: row.adjPValue,
          adjPValue2: compItem ? compItem.adjPValue : undefined,
          logFC1: row.logFC,
          logFC2: compItem ? compItem.logFC : undefined,
        });
      });
        secondaryGenes.forEach((row) => {
          items.push({
            gene_name: row.gene_name,
            AveExpr1: undefined,
            AveExpr2: row.AveExpr,
            adjPValue1: undefined,
            adjPValue2: row.adjPValue,
            logFC1: undefined,
            logFC2: row.logFC,
          });
        });
      return items;
    },
  },
  data: () => ({
    show: false,
    aveExpr1Input: 0,
    aveExpr2Input: 0,
    adjPVal1Input: 1,
    adjPVal2Input: 1,
    absLogFC1Input: 0,
    absLogFC2Input: 0,
  }),
};
</script>

<style scoped>
.flex {
    justify-content: space-between;
}
</style>