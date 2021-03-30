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
        <v-data-table
          dense
          :headers="geneAnalysisHeaders"
          :items="items"
          :footer-props="{ 'items-per-page-options': [20, 40, 50, 100] }"
        >
          <template
            v-for="(h, index) in geneAnalysisHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <span :key="index" v-html="header.text"></span>
          </template>
          <template v-slot:item.AveExpr="{item}">
            <p :title="item.AveExpr && item.AveExpr">
              {{item.AveExpr && item.AveExpr.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.AveExpr2="{item}">
            <p :title="item.AveExpr2 && item.AveExpr2">
              {{item.AveExpr2 && item.AveExpr2.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.deltaAveExpr="{ item }">
            <p :title="item.deltaAveExpr && item.deltaAveExpr">
              {{ item.deltaAveExpr && item.deltaAveExpr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.adjPValue="{item}">
            <p :title="item.adjPValue && item.adjPValue">
              {{item.adjPValue && item.adjPValue.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.adjPValue2="{item}">
            <p :title="item.adjPValue2 && item.adjPValue2">
              {{item.adjPValue2 && item.adjPValue2.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.logPVal1Over2="{item}">
            <p :title="item.logPVal1Over2 && item.logPVal1Over2">
              {{item.logPVal1Over2 && Math.round((item.logPVal1Over2 + Number.EPSILON)*100)/100}}
            </p>
          </template>
          <template v-slot:item.logFC="{item}">
            <p :title="item.logFC && item.logFC">
              {{item.logFC && item.logFC.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.logFC2="{item}">
            <p :title="item.logFC2 && item.logFC2">
              {{item.logFC2 && item.logFC2.toExponential(2)}}
            </p>
          </template>
          <template v-slot:item.logFCRatio="{item}">
            <p :title="item.logFCRatio && item.logFCRatio">
              {{item.logFCRatio && Math.round((item.logFCRatio + Number.EPSILON)*100)/100}}
            </p>
          </template>
          <template v-slot:body.append>
            <tr>
              <td colspan="1">
                <v-text-field
                  label="Search"
                  v-model="geneExpressionComparisonSearch"
                ></v-text-field>
              </td>
              <td colspan="2"></td>
              <td colspan="1">
                <v-text-field
                  prefix="abs(Δ AveExpr) ≥"
                  v-model="deltaAveExprInput"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="2"></td>
              <td>
                <v-text-field
                  prefix="abs(Ratio)≥"
                  v-model="logPVal1Over2Input"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
              <td colspan="2"></td>
              <td>
                <v-text-field
                  prefix="≥"
                  v-model="logFCRatioInput"
                  type="number"
                  min="0"
                  hide-details
                ></v-text-field>
              </td>
            </tr>
          </template> </v-data-table></v-card-text></v-expand-transition
  ></v-card>
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
        {
          text: "Gene Name",
          value: "gene_name",
          filter: (value) => {
            if (!this.geneExpressionComparisonSearch) return true;
            return value.includes(this.geneExpressionComparisonSearch);
          },
        },
        {
          text: "Ave Expr" + "1".sup(),
          value: "AveExpr",
          filter: (value) => {
            if (!this.aveExpr1Input || value === undefined) return true;
            return value >= Math.abs(this.aveExpr1Input);
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
          text: "Δ Ave Expr",
          value: "deltaAveExpr",
          filter: (value) => {
            if (!this.deltaAveExprInput || value === undefined) return true;
            return Math.abs(value) >= this.deltaAveExprInput;
          },
        },
        {
          text: "Adj Pval" + "1".sup(),
          value: "adjPValue",
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
          text: "log(AdjPVal" + "1".sup() + "/AdjPVal" + "2".sup() + ")",
          value: "logPVal1Over2",
          filter: (value) => {
            if(!this.logPVal1Over2Input || value === undefined) return true;
            return Math.abs(value) >= this.logPVal1Over2Input;
          }
        },
        {
          text: "LogFC" + "1".sup(),
          value: "logFC",
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
        {
          text: "(LogFC" + "1".sup() + "/LogFC" + "2".sup() + ")",
          value: "logFCRatio",
          filter: (value) => {
            if(!this.logFCRatioInput || value === undefined) return true;
            return Math.abs(value) >= this.logFCRatioInput
          }
        },
      ];
    },
    items() {
      const items = [...this.geneExpressionOne];
      const secondaryGenes = new Map();
      this.geneExpressionTwo.forEach((gene) =>
        secondaryGenes.set(gene.gene_name, gene)
      );

      //loop over  items and add values from second set of genes if available
      items.forEach((row) => {
        const compareItem = { ...secondaryGenes.get(row.gene_name) };
        if (!compareItem) return;

        row.AveExpr2 = compareItem.AveExpr;
        row.deltaAveExpr = compareItem.AveExpr - row.AveExpr;
        row.adjPValue2 = compareItem.adjPValue;
        row.logPVal1Over2 = Math.log(
          (row.adjPValue ? row.adjPValue : 0) /
          (row.adjPValue2)
        )
        row.logFC2 = compareItem.logFC;
        row.logFCRatio = (row.logFC ? row.logFC : 0) / (row.logFC2)
        secondaryGenes.delete(row.gene_name);
      });

      //for any missed values, change key names and add
      secondaryGenes.forEach((value) => {
        value.AveExpr2 = value.AveExpr;
        delete value.AveExpr;
        value.adjPValue2 = value.adjPValue;
        delete value.adjPValue;
        value.logFC2 = value.logFC;
        delete value.logFC;
      });
      items.push(...secondaryGenes.values());

      return items;
    },
  },
  data: () => ({
    show: false,
    aveExpr1Input: 0,
    aveExpr2Input: 0,
    deltaAveExprInput: 0,
    adjPVal1Input: 1,
    adjPVal2Input: 1,
    logPVal1Over2Input: 0,
    absLogFC1Input: 0,
    absLogFC2Input: 0,
    logFCRatioInput: 0,
    geneExpressionComparisonSearch: "",
  }),
};
</script>

<style scoped>
.flex {
  justify-content: space-between;
}
</style>