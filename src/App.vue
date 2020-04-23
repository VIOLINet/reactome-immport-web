<template>
  <div id="app">
    <form @submit.prevent="handleSubmit">
      <table>
        <h3 class="tableHeader">Perform Reactome enrichment on Vaccine data</h3>
        <tr>
          <td style="background-color:lightgrey;">Search Field</td>
          <td style="background-color:lightgrey;" class="searchColumn">Search Parameter</td>
        </tr>
        <tr>
          <td>Vaccine</td>
          <td>
            <div v-for="vaccine in this.vaccines" :key="vaccine.id" class="checkBox">
              <input
                type="checkbox"
                v-model="selectedVaccines"
                :value="vaccine.id"
              />
              <label :for="vaccine.name">{{ vaccine.name }}</label>
            </div>
          </td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>
            <div class="checkBox">
              <input type="checkbox" v-model="selectedGenders" value="male">
              <label for="male">Male</label>
            </div>
            <div class="checkBox">
              <input type="checkbox" v-model="selectedGenders" value="female">
              <label for="female">Female</label>
            </div>
          </td>
        </tr>
      </table>
      <input type="submit" value="analyze" />
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "App",
  components: {},
  data: () => ({
    vaccines: [
      {
        id: "VO_0004809",
        name: "2008-2009 Trivalent influenza vaccine"
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
    ],
    selectedVaccines: [],
    selectedGenders: []
  }),
  methods: {
    handleSubmit() {
      axios.post('http://localhost:8076/immportws/expSample/vaccine',
                {
                  voIds: this.selectedVaccines,
                  genderList: this.selectedGenders
                })
           .then(response => {
             console.log(response)
           })
           .catch(error => {
             console.error(error)
           })
    }
  }
};
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
td {
  outline: 1px solid grey;
}
.searchColumn {
  width: 50%;
}
table {
  margin: 0 auto;
  padding: 0;
  border: 1px solid grey;
}
.checkBox{
  text-align: left;
}
.tableHeader{
  margin: 0 auto;
  padding: 0;
  width: 100%;
}
</style>
