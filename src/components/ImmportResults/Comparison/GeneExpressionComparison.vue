<template>
  <v-card outlined>
    <v-card-title class="flex">
      <h4>Gene Expression Comparison</h4>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="ma-1" @click="downloadTable">
        Download Results
      </v-btn>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <v-card-text v-show="show">
        <plot :compareFrom="compareFrom"
              :compareTo="compareTo">
        </plot>
        <v-card outlined>
        <v-data-table
          dense
          :headers="geneAnalysisHeaders"
          :items="items"
          :footer-props="{ 'items-per-page-options': [10, 20, 50, 100] }"
          no-results-text="No genes. Try a less strict filter thresholds."
        >
          <template
            v-for="(h, index) in geneAnalysisHeaders"
            v-slot:[`header.${h.value}`]="{ header }"
          >
            <span :key="index" v-html="header.text"></span>
          </template>
          <template v-slot:item.AveExpr="{ item }">
            <p :title="item.AveExpr && item.AveExpr">
              {{ item.AveExpr && item.AveExpr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.AveExpr2="{ item }">
            <p :title="item.AveExpr2 && item.AveExpr2">
              {{ item.AveExpr2 && item.AveExpr2.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.deltaAveExpr="{ item }">
            <p :title="item.deltaAveExpr && item.deltaAveExpr">
              {{ item.deltaAveExpr && item.deltaAveExpr.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.adjPValue="{ item }">
            <p :title="item.adjPValue && item.adjPValue">
              {{ item.adjPValue && item.adjPValue.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.adjPValue2="{ item }">
            <p :title="item.adjPValue2 && item.adjPValue2">
              {{ item.adjPValue2 && item.adjPValue2.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.logPVal1Over2="{ item }">
            <p :title="item.logPVal1Over2 && item.logPVal1Over2">
              {{
                item.logPVal1Over2 &&
                Math.round((item.logPVal1Over2 + Number.EPSILON) * 100) / 100
              }}
            </p>
          </template>
          <template v-slot:item.logFC="{ item }">
            <p :title="item.logFC && item.logFC">
              {{ item.logFC && item.logFC.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.logFC2="{ item }">
            <p :title="item.logFC2 && item.logFC2">
              {{ item.logFC2 && item.logFC2.toExponential(2) }}
            </p>
          </template>
          <template v-slot:item.logFCRatio="{ item }">
            <p :title="item.logFCRatio && item.logFCRatio">
              {{
                item.logFCRatio &&
                Math.round((item.logFCRatio + Number.EPSILON) * 100) / 100
              }}
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
          </template> 
          </v-data-table>
          </v-card>
          </v-card-text>
          </v-expand-transition
  ></v-card>
</template>

<script>
import ComparisonVolcanoPlot from "../VolcanoPlot/ComparisonVolcanoPlot"

export default {
  name: "GeneExpressionComparison",
  components: {
    plot: ComparisonVolcanoPlot
  },
  
  props: {
    compareFrom: Object,
    compareTo: Object,
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
          text: "Ave Expr" + "a".sup(),
          value: "AveExpr",
        },
        {
          text: "Ave Expr" + "b".sup(),
          value: "AveExpr2",
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
          text: "Adj Pval" + "a".sup(),
          value: "adjPValue",
        },
        {
          text: "Adj Pval" + "b".sup(),
          value: "adjPValue2",
        },
        {
          text: "log(AdjPVal" + "a".sup() + "/AdjPVal" + "b".sup() + ")",
          value: "logPVal1Over2",
          filter: (value) => {
            if (!this.logPVal1Over2Input || value === undefined) return true;
            return Math.abs(value) >= this.logPVal1Over2Input;
          },
        },
        {
          text: "Log" + "2".sub() + "FC" + "a".sup(),
          value: "logFC",
        },
        {
          text: "Log" + "2".sub() + "FC" + "b".sup(),
          value: "logFC2",
        },
        {
          text:
            "(Log" +
            "2".sub() +
            "FC" +
            "a".sup() +
            "/Log" +
            "2".sub() +
            "FC" +
            "b".sup() +
            ")",
          value: "logFCRatio",
          filter: (value) => {
            if (!this.logFCRatioInput || value === undefined) return true;
            return Math.abs(value) >= this.logFCRatioInput;
          },
        },
      ];
    },
    items() {
      return this.generateItems();
    },
  },
  data: () => ({
    show: true,
    deltaAveExprInput: 0,
    logPVal1Over2Input: 0,
    logFCRatioInput: 0,
    geneExpressionComparisonSearch: "",
  }),

  methods: {

    generateItems() {
      const items = [...this.compareFrom.geneExpressionResults];
      const secondaryGenes = new Map();
      this.compareTo.geneExpressionResults.forEach((gene) =>
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
          (row.adjPValue ? row.adjPValue : 0) / row.adjPValue2
        );
        row.logFC2 = compareItem.logFC;
        row.logFCRatio = (row.logFC ? row.logFC : 0) / row.logFC2;
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

    downloadTable() {
      let str = "Gene Name,Ave Expr_a,Ave Expr_b,Delta Ave Expr,Adj Pval_a, Adj Pval_b, log(AdjPVal_a/AdjPVal_b), log2FC_a, Log2FC_b, Log2FC_a/Log2FC_b\n";
      let items = this.generateItems();
      items.forEach(item => {
        str += `${item.gene_name},`;
        (item.AveExpr) ? str += `${item.AveExpr},` : str += ",";
        (item.AveExpr2) ? str += `${item.AveExpr2},` : str += ",";
        (item.deltaAveExpr) ? str += `${item.deltaAveExpr},` : str += ",";
        (item.adjPValue) ? str += `${item.adjPValue},` : str += ",";
        (item.adjPValue2) ? str += `${item.adjPValue2},` : str += ",";
        (item.logPVal1Over2) ? str += `${item.logPVal1Over2},` : str += ",";
        (item.logFC) ? str += `${item.logFC},` : str += ",";
        (item.logFC2) ? str += `${item.logFC2},` : str += ",";
        (item.logFCRatio) ? str += `${item.logFCRatio}` : str += "";
        str += "\n";
      });
      const blob = new Blob([str], { type: "blob" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = 'GeneExpressionComparison.csv';
      link.click();
    },
  }

};
</script>

<style scoped>
.flex {
  justify-content: space-between;
}
</style>