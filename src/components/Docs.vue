<template>
  <div>
    <h2>ImmPort Reactome Analysis</h2>

    <p>
      This form allows users to select a set of vaccines for analysis. Return data can be filtered
      by biographical information and time of sample collection relative to vaccine exposure.
      GSM values derived from user selections will be analyzed using differential expression techniques,
      and then passed through the Reactome pathway enrichment analysis tool.
    </p>
    <p>
      These results, along with a set of functional interactions present for any hit genes, will be displayed below the form after the analysis is
      complete.
    </p>
  </div>
</template>

<script>
export default {
  name: "Docs"
};
</script>

<style scoped>
p {
    margin: 0 auto;
    text-align: left;
    width: 90%;
}
</style>