<template>
  <v-app id="app">
    <Docs />
    <v-container fluid>
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
                <input type="checkbox" v-model="selectedVaccines" :value="vaccine.id" />
                <label :for="vaccine.name">{{ vaccine.name }}</label>
              </div>
            </td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>
              <div class="checkBox">
                <input type="checkbox" v-model="selectedGenders" value="male" />
                <label for="male">Male</label>
              </div>
              <div class="checkBox">
                <input type="checkbox" v-model="selectedGenders" value="female" />
                <label for="female">Female</label>
              </div>
            </td>
          </tr>
          <tr>
            <td>Collection Times</td>
            <td>
              <select v-model="selectedTimes" :size="10" multiple class="multi-select">
                <option
                  v-for="time in collectionTimes"
                  :key="time.time + ' ' + time.units"
                  v-bind:value="''+time.time+'' + ' ' + time.units "
                >{{time.time + ' ' + time.units}}</option>
              </select>
            </td>
          </tr>
        </table>
        <v-btn small class="submitButton" @click="handleSubmit" primary>Analyze</v-btn>
      </form>
    </v-container>
    <v-container>
      <span
        style="color:red; text-align:left;"
        v-for="(message, index) in errorMessages"
        :key="index"
      >{{message}}</span>
    </v-container>
    <ResultList :formSubmissions="formData"  v-if="formData && formData.length > 0"/>
    <!-- <ResultsPanel :immportRequestData="formData" v-if="formSubmitted" /> -->
  </v-app>
</template>

<script>
import ResultList from "./components/ImmportResults/ResultList";
// import ResultsPanel from "./components/ImmportResults/ResultsPanel";
import Docs from "./components/Docs";

export default {
  name: "App",
  components: {
    ResultList,
    // ResultsPanel,
    Docs
  },
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
    collectionTimes: [
      {
        time: "-7.0",
        units: "Days"
      },
      {
        time: "-168.0",
        units: "Hours"
      },
      {
        time: "0.0",
        units: "Hours"
      },
      {
        time: "0.0",
        units: "Days"
      },
      {
        time: "1.5",
        units: "Hours"
      },
      {
        time: "3.0",
        units: "Hours"
      },
      {
        time: "6.0",
        units: "Hours"
      },
      {
        time: "9.0",
        units: "Hours"
      },
      {
        time: "12.0",
        units: "Hours"
      },
      {
        time: "0.5",
        units: "Days"
      },
      {
        time: "15.0",
        units: "Hours"
      },
      {
        time: "24.0",
        units: "Hours"
      },
      {
        time: "1.0",
        units: "Days"
      },
      {
        time: "36.0",
        units: "Hours"
      },
      {
        time: "48.0",
        units: "Hours"
      },
      {
        time: "2.0",
        units: "Days"
      },
      {
        time: "3.0",
        units: "Days"
      },
      {
        time: "4.0",
        units: "Days"
      },
      {
        time: "5.0",
        units: "Days"
      },
      {
        time: "7.0",
        units: "Days"
      },
      {
        time: "8.0",
        units: "Days"
      },
      {
        time: "9.0",
        units: "Days"
      },
      {
        time: "10.0",
        units: "Days"
      },
      {
        time: "11.0",
        units: "Days"
      },
      {
        time: "14.0",
        units: "Days"
      },
      {
        time: "17.0",
        units: "Days"
      },
      {
        time: "21.0",
        units: "Days"
      },
      {
        time: "24.0",
        units: "Days"
      },
      {
        time: "25.0",
        units: "Days"
      },
      {
        time: "27.0",
        units: "Days"
      },
      {
        time: "28.0",
        units: "Days"
      },
      {
        time: "30.0",
        units: "Days"
      },
      {
        time: "32.0",
        units: "Days"
      },
      {
        time: "35.0",
        units: "Days"
      },
      {
        time: "36.0",
        units: "Days"
      },
      {
        time: "37.0",
        units: "Days"
      },
      {
        time: "38.0",
        units: "Days"
      },
      {
        time: "41.0",
        units: "Days"
      },
      {
        time: "43.0",
        units: "Days"
      },
      {
        time: "46.0",
        units: "Days"
      },
      {
        time: "49.0",
        units: "Days"
      },
      {
        time: "180.0",
        units: "Days"
      }
    ],
    selectedVaccines: [],
    selectedGenders: [],
    selectedTimes: [],
    errorMessages: [],
    formSubmitted: false,
    formData: []
  }),
  methods: {
    handleSubmit() {
      if (!this.validateForm()) return;
      this.errorMessages = [];
      const submitted = {
        voIds: this.selectedVaccines,
        genderList: this.selectedGenders,
        times: this.selectedTimes
      };
      if (!(this.formData.some(el => el.voIds === submitted.voIds && el.genderList === submitted.genderList && el.times === submitted.times))) {
        this.formData.push(submitted);
      }
      this.formSubmitted = true;
    },
    validateForm() {
      this.errorMessages = [];
      let rtn = true;
      if (this.selectedVaccines.length <= 0) {
        this.errorMessages.push("You must choose at least 1 vaccine. ");
        rtn = false;
      }
      if (this.selectedGenders.length <= 0) {
        this.errorMessages.push("You must choose at least 1 sex. ");
        rtn = false;
      }
      if (this.selectedTimes <= 0) {
        this.errorMessages.push("You must choose at least 1 time. ");
        rtn = false;
      }
      return rtn;
    },
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
  width: 90%;
  padding: 0;
  border: 1px solid grey;
}
.checkBox {
  text-align: left;
}
.tableHeader {
  margin: 0 auto;
  padding: 0;
  width: 100%;
}
.multi-select {
  margin: 0.5em;
  width: 10em;
  height: 10em;
  border: 1px solid black;
}
.submitButton {
  margin: 0.5em;
}
#app canvas {
  /* Fix for cytoscape issue where canvas is placed incorrectly */
  top: 0;
  left: 0;
}
</style>
