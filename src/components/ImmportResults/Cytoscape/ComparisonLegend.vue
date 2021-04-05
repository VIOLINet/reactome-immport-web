<template>
  <div style="">
      <div class="flex">
          <p>a node</p>
          <div class="nodeCircle" style="background-color:var(--node-a-color)"></div>
      </div>
      <div class="flex">
          <p>b node</p>
          <div class="nodeCircle" style="background-color:var(--node-b-color)"></div>
      </div>
      <div class="flex">
          <p>a & b node</p>
          <div class="nodeCircle" style="background-color:var(--node-a-b-color)"></div>
      </div>
      <div class="flex">
          <p>a edge</p>
          <div class="edge" style="background-color:var(--edge-a-color)"></div>
      </div>
      <div class="flex">
          <p>b edge</p>
          <div class="edge" style="background-color:var(--edge-b-color)"></div>
      </div>
      <div class="flex">
          <p>a & b edge</p>
          <div class="edge" style="background-color:var(--edge-a-b-color)"></div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
p {
    margin:0 20px 0 0 !important;
}
.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.nodeCircle {
    border-radius: 16px;
    height:16px;
    width:16px;
}
.edge {
    height: 3px;
    width: 16px;
}
</style>