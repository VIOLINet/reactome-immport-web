<template>
  <div>
    <h2>ImmPort Reactome Analysis</h2>
    <br>
    <p>
      This web app allows users to select a set of vaccines and gene expression datasets for differential gene expression analysis using
      <a target="_blank" href="https://bioconductor.org/packages/release/bioc/html/limma.html">limma</a> for vaccination response studies. 
      The list of selected differentially expressed genes between two groups can then be submitted to <a target="_blank" href="https://reactome.org">
      Reactome</a>, an open access biological pathway knowledgebase, for pathway enrichment and network analyses. The results from these 
      analyses are displayed here for visualization. The vaccines are organized based on the vaccine ontology hosted at  
      <a target="_blank" href="http://www.violinet.org/vaccineontology/index.php">VIOLINET</a>, a web-based vaccine database and analysis platform.
      The original data was collected from <a target="_blank" href="https://www.immport.org/home">ImmPort</a>, a NIH supported database hosting 
      immunological studies, and then pre-processed locally.
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
    width: 95%;
}
</style>