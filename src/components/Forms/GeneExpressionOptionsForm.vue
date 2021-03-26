<template>
  <v-card-text>
    <div>
      <v-radio-group v-model="modelTime">
        <v-radio
          :value="true"
          :label="`Use the time directly in the model`"
        ></v-radio>
        <v-radio
          :value="false"
          :label="`Create two groups for differential analysis`"
        ></v-radio>
      </v-radio-group>
      <div>
        <v-row class="text-left">
          <v-col cols="12" md="4">
            <p class="text-left mb-0 pb-0">
              Time (days)<span class="float-right">Samples</span>
            </p>
            <v-sheet color="#ddd" class="scrollable" style="height: 24.5em">
              <v-list
                :disabled="modelTime"
                dense
                style="background-color: transparent"
                height="100%"
              >
                <draggable
                  v-model="timeSamples"
                  :group="'grouping'"
                  style="height: 100%"
                >
                  <template v-for="ts in timeSamples">
                    <v-list-item dense :key="ts.time" class="listItem">
                      <div class="flex">
                        <div>
                          {{ ts.time }}
                        </div>
                        <div>
                          {{ ts.sampleCount }}
                        </div>
                      </div>
                    </v-list-item>
                  </template>
                </draggable>
              </v-list>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4">
            <p class="text-left mb-0 pb-0">
              Time (days)<span class="float-right">Samples</span>
            </p>
            <v-sheet color="#ddd" class="inputBox pa-2 ma-1">
              Group 1
              <v-divider></v-divider>
              <v-list dense style="background-color: transparent" height="100%">
                <draggable
                  v-model="groupOne"
                  :group="'grouping'"
                  style="height: 100%"
                >
                  <template
                    v-for="ts2 in groupOne
                      .slice()
                      .sort((a, b) => a.time - b.time)"
                  >
                    <v-list-item dense :key="ts2.time" class="listItem">
                      <div class="flex">
                        <div>
                          {{ ts2.time }}
                        </div>
                        <div>
                          {{ ts2.sampleCount }}
                        </div>
                      </div>
                    </v-list-item>
                  </template>
                </draggable>
              </v-list>
            </v-sheet>
            <v-sheet color="#ddd" class="inputBox pa-2 ma-1">
              Group 2
              <v-divider></v-divider>
              <v-list dense style="background-color: transparent" height="100%">
                <draggable
                  v-model="groupTwo"
                  :group="'grouping'"
                  style="height: 100%"
                >
                  <template
                    v-for="ts3 in groupTwo
                      .slice()
                      .sort((a, b) => a.time - b.time)"
                  >
                    <v-list-item dense :key="ts3.time" class="listItem">
                      <div class="flex">
                        <div>
                          {{ ts3.time }}
                        </div>
                        <div>
                          {{ ts3.sampleCount }}
                        </div>
                      </div>
                    </v-list-item>
                  </template>
                </draggable>
              </v-list>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4" style="height: 100%" class="mt-0 mb-0">
            Other Options
            <v-sheet color="#ddd" class="scrollable pa-2" height="24.5em">
              <p class="text-left">
                Analysis can be adjusted by choosing the following variables:
              </p>
              <v-row>
                <v-col
                  cols="6"
                  v-for="variable in confoundingVariables"
                  :key="variable.value"
                >
                  <v-checkbox
                    dense
                    class="shrink ma-0 pa-0"
                    v-model="selectedConfoundingVariables"
                    :value="variable.value"
                    :label="variable.displayName"
                  >
                  </v-checkbox>
                </v-col>
              </v-row>
              <p class="text-left">
                The expression data can be corrected for the platform
              </p>
              <v-checkbox
                dense
                class="shrink ma-0 pa-0"
                :v-model="corrected"
                :value="corrected"
                :input-value="corrected"
                label="Corrected"
              ></v-checkbox>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-row class="mt-5">
      <v-col cols="12" class="text-right">
        <v-btn color="secondary" class="float-left" @click="fireBackEvent"
          >Back</v-btn
        >
        <span style="color: red" class="mr-5">{{ errormsg }}</span>
        <v-btn color="tertiary" class="mr-2" @click="clearForm">Clear</v-btn>
        <v-btn color="primary" @click="analyzeEvent">Analyze</v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "GeneExpressionOptionsForm",
  components: {
    draggable,
  },
  props: {
    biosampleMetaData: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    modelTime: true,
    timeSamples: [],
    groupOne: [],
    groupTwo: [],
    confoundingVariables: [
      { displayName: "Vaccine", value: "vaccine" },
      { displayName: "Age", value: "age_group" },
      { displayName: "Gender", value: "gender" },
      { displayName: "Race", value: "race" },
    ],
    selectedConfoundingVariables: [],
    corrected: true,
    errormsg: "",
  }),
  watch: {
    biosampleMetaData() {
      this.updatedAvailableTimesTwo();
    },
    modelTime() {
      if (this.modelTime) {
        this.resetTimes();
      }
    },
  },
  methods: {
    updatedAvailableTimes() {
      //called every time next is hit from filtering biosamples so want to ensure this is cleared to reset additions
      this.timeSamples = [];
      this.groupOne = [];
      this.groupTwo = [];

      this.biosampleMetaData.forEach((sample) => {
        if (sample.immport_vaccination_time === undefined) return;
        const time = parseInt(sample.immport_vaccination_time);
        if (!this.timeSamples.some((ts) => ts.time === time)) {
          this.timeSamples.push({
            time: time,
            sampleCount: 0,
          });
        }
        const ts = this.timeSamples.find((ts) => ts.time === time);
        ts.sampleCount += 1;
      });
      this.timeSamples.sort((a, b) => a.time - b.time);
    },
    updatedAvailableTimesTwo() {
      let timesArray = [];
      this.biosampleMetaData.forEach((sample) => {
        if (sample.immport_vaccination_time === undefined) return;
        const time = parseInt(sample.immport_vaccination_time);
        if (!timesArray.some((ts) => ts.time === time)) {
          timesArray.push({
            time: time,
            sampleCount: 0,
          });
        }
        timesArray.find((ts) => ts.time === time).sampleCount += 1;
      });

      this.groupOne = this.groupOne.filter(ts => timesArray.some( ta => ta.time === ts.time))
      this.groupOne.forEach(ts => {
        ts.sampleCount = timesArray.find(ta => ta.time === ts.time).sampleCount
        timesArray = timesArray.filter(ta => ta.time !== ts.time)
      });

      this.groupTwo = this.groupTwo.filter(ts => timesArray.some(ta => ta.time === ts.time));
      this.groupTwo.forEach(ts => {
        ts.sampleCount = timesArray.find(ta => ta.time === ts.time).sampleCount
        timesArray = timesArray.filter(ta => ta.time !== ts.time)
      });

      this.timeSamples = this.timeSamples.filter(ts => timesArray.includes(ts.time))
      timesArray.forEach(ta => {
        if(this.timeSamples.some(ts => ts.time === ta.time))
          this.timeSamples.find(ts => ts.time === ta.time).sampleCount = ta.sampleCount
        else
          this.timeSamples.push(ta)
      })
      this.timeSamples.sort((a, b) => a.time - b.time);
    },
    moveTime(startingCol, ts) {
      if (startingCol === 0) {
        this.timeSamples2.push(ts);
        this.timeSamples = this.timeSamples.filter(
          (obj) => obj.time !== ts.time
        );
      } else if (startingCol === 1) {
        this.timeSamples.push(ts);
        this.timeSamples2 = this.timeSamples2.filter(
          (obj) => obj.time !== ts.time
        );
      }
    },
    clearForm() {
      this.resetTimes();
      this.selectedConfoundingVariables = [];
      this.corrected = true;
      this.errormsg = "";
    },
    resetTimes() {
      this.timeSamples = [
        ...this.timeSamples,
        ...this.groupOne,
        ...this.groupTwo,
      ];
      this.timeSamples.sort((a, b) => a.time - b.time);
      this.groupOne = [];
      this.groupTwo = [];
    },
    analyzeEvent() {
      const data = {};
      data.modelTime = this.modelTime;
      if (!this.modelTime) {
        data.analysisGroups = {
          group1: this.groupOne.map((s) => s.time),
          group2: this.groupTwo.map((s) => s.time),
        };
        if(data.analysisGroups.group1.length < 1 || data.analysisGroups.group2.length < 1){
          this.errormsg = "Use time directly in model or select at least 1 time per group."
          return 
        }
      }
      data.studyCohort = this.selectedConfoundingVariables;
      data.platformCorrection = this.corrected;
      data.variableGenes = false; //set as default. Could be added to form later
      this.errormsg = ""
      this.$emit("optionsSelectedEvent", data);
    },
    fireBackEvent() {
      this.$emit("backEvent");
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.scrollable {
  overflow: scroll;
}
.inputBox {
  height: 12em;
  overflow: scroll;
}
.listItem {
  margin: 0 1em;
  border: 1px solid gray;
  background-color: white;
  border-radius: 5px;
}
.multi-drag {
  border: 1px dotted red;
}
</style>