<template>
  <v-card-text>
    <div>
      <v-radio-group v-model="groupTimes">
        <v-radio
          :value="false"
          :label="`Use the time directly in the model`"
        ></v-radio>
        <v-radio
          :value="true"
          :label="`Create two groups for differential analysis`"
        ></v-radio>
      </v-radio-group>
      <div>
        <v-row class="pa-0 ma-0" style="height: 26em">
          <v-col cols="12" md="4" style="height: 100%" class="mt-0 mb-0">
           <p class="text-left mb-0 pb-0">Time(Days)<span class="float-right">Samples</span></p>
            <v-sheet color="grey lighten-2"  class="scrollable fill-height">
              <v-list :disabled="!groupTimes" dense style="background-color: transparent" height="100%">
                <draggable
                  v-model="timeSamples"
                  :group="'grouping'"
                  style="height: 100%"
                >
                  <template v-for="ts in timeSamples">
                    <v-list-item dense :key="ts.time">
                      <v-list-item-content>
                        <p class="text-left">{{ ts.time }}<span class="float-right">{{ ts.sampleCount }}</span></p>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- <v-divider :key="ts.time"></v-divider> -->
                  </template>
                </draggable>
              </v-list>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4" style="height: 100%;" class="mt-0 mb-0">
            <p class="text-left mb-0 pb-0">Time(Days)<span class="float-right">Samples</span></p>
            <div style="height: 50%" class="pb-1 pl-1 pr-1">
              <v-sheet color="grey lighten-2" height="100%" class="scrollable">
                  Group 1
                  <v-divider></v-divider>
                <v-list dense style="background-color: transparent" height="100%">
                  <draggable
                    v-model="groupOne"
                    :group="'grouping'"
                    style="height: 100%"
                  >
                    <template v-for="ts2 in groupOne.slice().sort((a,b) => a.time-b.time)">
                    <v-list-item :key="ts2.time">
                      <v-list-item-content>
                        <p class="text-left">{{ ts2.time }}<span class="float-right">{{ ts2.sampleCount }}</span></p>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- <v-divider :key="ts2.time"></v-divider> -->
                  </template>
                  </draggable>
                </v-list>
              </v-sheet>
            </div>
            <div style="height: 50%" class="pt-1 pr-1 pl-1">
              <v-sheet color="grey lighten-2" height="100%" class="scrollable">
                  Group 2
                  <v-divider></v-divider>
                <v-list dense style="background-color: transparent" height="100%">
                  <draggable
                    v-model="groupTwo"
                    :group="'grouping'"
                    style="height: 100%"
                  >
                    <template v-for="ts3 in groupTwo.slice().sort((a,b) => a.time-b.time)">
                    <v-list-item :key="ts3.time">
                      <v-list-item-content>
                        <p class="text-left">{{ ts3.time }}<span class="float-right">{{ ts3.sampleCount }}</span></p>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- <v-divider :key="ts3.time"></v-divider> -->
                  </template>
                  </draggable>
                </v-list>
              </v-sheet>
            </div>
          </v-col>
          <v-col cols="12" md="4" style="height:100%;" class="mt-0 mb-0">
            Other Options
            <v-sheet color="grey lighten-2" height="100%" class="scrollable pa-1">
              <p class="text-left">
                Analysis can be adjusted by choosing the following variables:
              </p>
              <v-checkbox
                dense
                class="shrink ma-0 pa-0"
                v-for="(variable, index) in confoundingVariables"
                :key="index"
                v-model="selectedConfoundingVariables"
                :value="variable"
                :label="variable"
              >
              </v-checkbox>
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
    groupTimes: false,
    originalTimeSamples: [],
    timeSamples: [],
    groupOne: [],
    groupTwo: [],
    confoundingVariables: ["Vaccine", "Age", "Gender", "Race"],
    selectedConfoundingVariables: [],
    corrected: true,
    errormsg: "",
  }),
  created() {
    this.biosampleMetaData.forEach((sample) => {
      if(sample.immport_vaccination_time === undefined) return;
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
    this.timeSamples.sort((a,b) => a.time-b.time)
    this.originalTimeSamples = this.timeSamples; //store on originalTimeSamples for form clear
  },
  watch: {
    groupTimes() {
      if(!this.groupTimes){
        this.timeSamples = this.originalTimeSamples
        this.groupOne = [];
        this.groupTwo = [];
      }
    }
  },
  methods: {
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
      this.timeSamples = this.originalTimeSamples;
      this.timeSamples2 = [];
      this.timeSamples3 = [];
      this.selectedConfoundingVariables = [];
      this.corrected = false;
      this.errormsg = "";
    },
    analyzeEvent() {},
    fireBackEvent() {
      this.$emit("backEvent");
    },
  },
};
</script>

<style scoped>
.scrollable {
  overflow: scroll;
}
</style>