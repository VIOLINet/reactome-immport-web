<template>
  <div id="app">
    <form action="submit"></form>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    vaccines: [
      {
        id: "VO_0004809",
        name: "2008-2009 trivalent influenza vaccine"
      },
      {
        id: "VO_0000047",
        name: "Fluzone"
      },
      {
        id: "VO_0000642",
        name: "Influenza virus vaccine"
      },
      {
        id: "VO_0000044",
        name: "FluMist"
      },
      {
        id: "VO_0000045",
        name: "Fluarix"
      }
    ]
  }),
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
