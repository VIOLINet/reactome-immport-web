<template>
  <v-card-text>
    <v-row class="text-left">
      <v-col cols="12" md="3">
        <v-sheet color="grey lighten-2" class="pa-2 scrollable" height="24.5em"
          ><v-treeview
            dense
            open-all
            selectable
            selection-type="all"
            v-model="vaccinesSelected"
            :items="vaccines"
            class="smallFont"
          ></v-treeview
        ></v-sheet>
      </v-col>
      <v-col cols="12" md="3">
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox"
          >Studies
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableStudies.length > 1"
            label="Select All"
            :value="selectAllStudies"
            :input-value="selectAllStudies"
            v-model="selectAllStudies"></v-checkbox>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(def, index) in availableStudies"
            :key="index"
            :disabled="availableStudies.length === 1 ? true : false"
            v-model="selectedStudies"
            :label="def"
            :value="def"
            @click="selectAllStudies = false"
          ></v-checkbox
        ></v-sheet>
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox">
          Platform Description
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availablePlatforms.length > 1"
            label="Select All"
            :value="selectAllPlatforms"
            :input-value="selectAllPlatforms"
            v-model="selectAllPlatforms"></v-checkbox>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(def, index) in availablePlatforms"
            :key="index"
            :disabled="availablePlatforms.length === 1 ? true : false"
            v-model="selectedPlatforms"
            :label="def"
            :value="def"
            @click="selectAllPlatforms = false"
          ></v-checkbox>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="3">
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox"
          >Day 0 Definition
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableDayDefinitions.length > 0"
            label="Select All"
            :value="selectAllDay0Defs"
            :input-value="selectAllDay0Defs"
            v-model="selectAllDay0Defs"
          ></v-checkbox>
          <v-checkbox
            :dense="true"
            class="shrink ma-0 pa-0 smallFont"
            v-for="(def, index) in availableDayDefinitions"
            :key="index"
            :disabled="availableDayDefinitions.length === 1 ? true : false"
            v-model="selectedDayDefinitions"
            :label="def"
            :value="def"
            @click="selectAllDay0Defs = false"
          ></v-checkbox
        ></v-sheet>
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox">
          Gender
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableGenders.length > 0"
            label="Select All"
            :value="selectAllGenders"
            :input-value="selectAllGenders"
            v-model="selectAllGenders"
          ></v-checkbox>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(gender, index) in availableGenders"
            :key="index"
            :disabled="availableGenders.length === 1 ? true : false"
            v-model="selectedGenders"
            :label="gender"
            :value="gender"
            @click="selectAllGenders = false"
          ></v-checkbox>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="3">
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox"
          >Age
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableAgeGroups.length > 1"
            label="Select All"
            :value="selectAllAges"
            :input-value="selectAllAges"
            v-model="selectAllAges"
          ></v-checkbox>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(age, index) in availableAgeGroups"
            :key="index"
            :disabled="availableAgeGroups.length === 1 ? true : false"
            v-model="selectedAges"
            :label="age"
            :value="age"
            @click="selectAllAges = false"
          ></v-checkbox
        ></v-sheet>
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox">
          Race
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableRaces.length > 1"
            label="Select All"
            :value="selectAllRaces"
            :input-value="selectAllRaces"
            v-model="selectAllRaces"
          ></v-checkbox>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(race, index) in availableRaces"
            :key="index"
            :disabled="availableRaces.length === 1 ? true : false"
            v-model="selectedRaces"
            :label="race"
            :value="race"
            @click="selectAllRaces = false"
          ></v-checkbox>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-right">
        <span style="color: red" class="mr-5">{{ errormsg }}</span>
        <v-btn color="tertiary" class="mr-2" @click="clearVOForm">Clear</v-btn>
        <v-btn color="primary" @click="filterBiosamples">Next</v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
export default {
  name: "BiosampleFilterForm",
  data: () => ({
    vaccines: [
      {
        name: "vaccine",
        id: "VO_0000001",
        children: [
          {
            name: "inactivated vaccine",
            id: "VO_0000315",
            children: [
              {
                name: "2008-2009 trivalent influenza vaccine",
                id: "VO_0004809",
              },
              {
                name: "Fluarix",
                id: "VO_0000045",
              },
              {
                name: "Fluzone",
                id: "VO_0000047",
              },
            ],
          },
          {
            name: "live attenuated vaccine",
            id: "VO_0000367",
            children: [
              {
                name: "FluMist",
                id: "VO_0000044",
              },
            ],
          },
          {
            name: "viral vaccine",
            id: "VO_0000609",
            children: [
              {
                name: "Influenze Virus Vaccine",
                id: "VO_0000642",
                children: [
                  {
                    name: "2008-2009 trivalent influenza vaccine",
                    id: "VO_0004809",
                  },
                  {
                    name: "Fluarix",
                    id: "VO_0000045",
                  },
                  {
                    name: "FluMist",
                    id: "VO_0000044",
                  },
                  {
                    name: "Fluzone",
                    id: "VO_0000047",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    vaccinesSelected: [],
    selectedGenders: [],
    selectedAges: [],
    selectedRaces: [],
    selectedDayDefinitions: [],
    selectedPlatforms: [],
    selectedStudies: [],
    filteredBiosampleMetaData: [],
    errormsg: "",
    selectAllStudies: false,
    selectAllPlatforms: false,
    selectAllDay0Defs: false,
    selectAllRaces: false,
    selectAllAges: false,
    selectAllGenders: false
  }),
  props: {
    biosampleMetaData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    availableStudies() {
      return [
        ...new Set(
          this.biosampleMetaData
            .filter((sample) =>
              this.vaccinesSelected.includes(
                sample.immport_immune_exposure_material_id
              )
            )
            .map((s) => s.immport_study_accession)
        ),
      ];
    },
    availablePlatforms() {
      return [
        ...new Set(
          this.biosampleMetaData
            .filter(
              (sample) =>
                this.vaccinesSelected.includes(
                  sample.immport_immune_exposure_material_id
                ) &&
                this.selectedStudies.includes(sample.immport_study_accession)
            )
            .map((s) => s.platform_desc)
        ),
      ];
    },
    availableDayDefinitions() {
      return [
        ...new Set(
          this.biosampleMetaData
            .filter(
              (sample) =>
                this.vaccinesSelected.includes(
                  sample.immport_immune_exposure_material_id
                ) &&
                this.selectedStudies.includes(sample.immport_study_accession) &&
                this.selectedPlatforms.includes(sample.platform_desc)
            )
            .map((s) => s.day_0_def)
        ),
      ];
    },
    availableGenders() {
      const samples = this.biosampleMetaData.filter(
        (sample) =>
          this.vaccinesSelected.includes(
            sample.immport_immune_exposure_material_id
          ) &&
          this.selectedStudies.includes(sample.immport_study_accession) &&
          this.selectedPlatforms.includes(sample.platform_desc) &&
          this.selectedDayDefinitions.includes(sample.day_0_def)
      );
      return [...new Set(samples.map((s) => s.gender))];
    },
    availableAgeGroups() {
      const samples = this.biosampleMetaData.filter(
        (sample) =>
          this.vaccinesSelected.includes(
            sample.immport_immune_exposure_material_id
          ) &&
          this.selectedStudies.includes(sample.immport_study_accession) &&
          this.selectedPlatforms.includes(sample.platform_desc) &&
          this.selectedDayDefinitions.includes(sample.day_0_def) &&
          this.selectedGenders.includes(sample.gender)
      );
      return [...new Set(samples.map((s) => s.age_group))];
    },
    availableRaces() {
      return [
        ...new Set(
          this.biosampleMetaData
            .filter(
              (sample) =>
                this.vaccinesSelected.includes(
                  sample.immport_immune_exposure_material_id
                ) &&
                this.selectedStudies.includes(sample.immport_study_accession) &&
                this.selectedPlatforms.includes(sample.platform_desc) &&
                this.selectedDayDefinitions.includes(sample.day_0_def) &&
                this.selectedGenders.includes(sample.gender) &&
                this.selectedAges.includes(sample.age_group)
            )
            .map((s) => s.race)
        ),
      ];
    },
  },
  watch: {
    availableGenders() {
      this.selectedGenders = [];
      if (this.availableGenders.length === 1) {
        this.selectedGenders.push(...this.availableGenders);
      }
    },
    selectAllGenders(selected) {
      if(selected)
        this.selectedGenders.push(...this.availableGenders.filter(gender => !this.selectedGenders.includes(gender)))
      else if(this.selectedGenders.length === this.availableGenders.length)
        this.selectedGenders = []
    },
    availableAgeGroups() {
      this.selectedAges = [];
      if (this.availableAgeGroups.length === 1) {
        this.selectedAges.push(...this.availableAgeGroups);
      }
    },
    selectAllAgeGroups(selected) {
      if(selected)
        this.selectedAges.push(...this.availableAgeGroups.filter(age => !this.selectedAges.includes(age)))
      else if(this.selectedAges.length === this.availableAgeGroups.length)
        this.selectedAges = []
    },
    availableRaces() {
      this.selectedRaces = [];
      if (this.availableRaces.length === 1) {
        this.selectedRaces.push(...this.availableRaces);
      }
    },
    selectAllRaces(selected) {
      if(selected)
        this.selectedRaces.push(...this.availableRaces.filter(race => !this.selectedRaces.includes(race)));
      else if(this.selectedRaces.length === this.availableRaces.length)
        this.selectedRaces = []
    },
    availableDayDefinitions() {
      this.selectedDayDefinitions = [];
      if (this.availableDayDefinitions.length === 1) {
        this.selectedDayDefinitions.push(...this.availableDayDefinitions);
      }
    },
    selectAllDay0Defs(selected) {
      if(selected)
        this.selectedDayDefinitions.push(...this.availableDayDefinitions.filter(def => !this.selectedDayDefinitions.includes(def)))
      else if (this.selectedDayDefinitions.length === this.availableDayDefinitions.length)
        this.selectedDayDefinitions = []
    },
    availablePlatforms() {
      this.selectedPlatforms = [];
      if (this.availablePlatforms.length === 1) {
        this.selectedPlatforms.push(...this.availablePlatforms);
      }
    },
    selectAllPlatforms(selected) {
      if(selected)
        this.selectedPlatforms.push(...this.availablePlatforms.filter(platform => !this.selectedPlatforms.includes(platform)))
      else if(this.selectedPlatforms.length === this.availablePlatforms.length)
        this.selectedPlatforms = [];
    },
    availableStudies() {
      this.selectedStudies = [];
      if (this.availableStudies.length === 1) {
        this.selectedStudies.push(...this.availableStudies);
      }
    },
    selectAllStudies(selected) {
      if(selected)
        this.selectedStudies.push(...this.availableStudies.filter(study => !this.selectedStudies.includes(study)))
      else if(this.selectedStudies.length === this.availableStudies.length)
        this.selectedStudies = []
    }
  },
  methods: {
    //effectively clears all selections because they all depend on vaccinesSelected
    clearVOForm() {
      this.vaccinesSelected = [];
    },
    filterBiosamples() {
      const biosamples = this.biosampleMetaData.filter(
        (sample) =>
          this.vaccinesSelected.includes(
            sample.immport_immune_exposure_material_id
          ) &&
          this.selectedStudies.includes(sample.immport_study_accession) &&
          this.selectedPlatforms.includes(sample.platform_desc) &&
          this.selectedDayDefinitions.includes(sample.day_0_def) &&
          this.selectedGenders.includes(sample.gender) &&
          this.selectedAges.includes(sample.age_group)
      );
      if (biosamples.length === 0) {
        this.errormsg =
          "No biosamples could be selected based on these options. All Options must have a selection.";
        return;
      }
      this.$emit("biosamplesFilteredEvent", biosamples);
    },
  },
};
</script>

<style scoped>
.scrollable {
  overflow: scroll;
}
.inputBox {
  height: 12em;
  overflow: scroll;
}
.smallFont >>> label{
  font-size: 14px !important;
}
</style>