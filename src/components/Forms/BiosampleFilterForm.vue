<template>
  <v-card-text>
    <v-row class="text-left">
      <v-col cols="12" md="3">
        <v-sheet color="grey lighten-2" class="pa-2 scrollable" height="24.5em"
          ><v-treeview
            dense
            open-all
            selectable
            selection-type="leaf"
            v-model="vaccineIdsSelected"
            :items="vaccineHierarchy"
            class="smallFont"
          ></v-treeview
        ></v-sheet>
      </v-col>
      <v-col cols="12" md="3">
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox">
          <p class="header">Studies</p>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableStudies.length > 1"
            label="Select All"
            :value="selectAllStudies"
            :input-value="selectAllStudies"
            v-model="selectAllStudies"
          ></v-checkbox>
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
          <p class="header">Platform Description</p>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availablePlatforms.length > 1"
            label="Select All"
            :value="selectAllPlatforms"
            :input-value="selectAllPlatforms"
            v-model="selectAllPlatforms"
          ></v-checkbox>
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
          ><p class="header">Day 0 Definition</p>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableDayDefinitions.length > 1"
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
          <p class="header">Gender</p>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableGenders.length > 1"
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
          ><p class="header">Age</p>
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
          <p class="header">Race</p>
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
    vaccineHierarchy: [
      {
        name: "vaccine",
        id: 0,
        voId: "VO_0000001",
        children: [
          {
            name: "inactivated vaccine",
            id: 1,
            voId: "VO_0000315",
            children: [
              {
                name: "2008-2009 trivalent influenza vaccine",
                id: 2,
                voId: "VO_0004809",
              },
              {
                name: "Fluarix",
                id: 3,
                voId: "VO_0000045",
              },
              {
                name: "Fluzone",
                id: 4,
                voId: "VO_0000047",
              },
            ],
          },
          {
            name: "live attenuated vaccine",
            id: 5,
            voId: "VO_0000367",
            children: [
              {
                name: "FluMist",
                id: 6,
                voId: "VO_0000044",
              },
            ],
          },
          {
            name: "viral vaccine",
            id: 7,
            voId: "VO_0000609",
            children: [
              {
                name: "Influenze Virus Vaccine",
                id: 8,
                voId: "VO_0000642",
                children: [
                  {
                    name: "2008-2009 trivalent influenza vaccine",
                    id: 9,
                    voId: "VO_0004809",
                  },
                  {
                    name: "Fluarix",
                    id: 10,
                    voId: "VO_0000045",
                  },
                  {
                    name: "FluMist",
                    id: 11,
                    voId: "VO_0000044",
                  },
                  {
                    name: "Fluzone",
                    id: 12,
                    voId: "VO_0000047",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    vaccineMap: [
      { voId: "VO_0000047", ids: [4, 12], name: "Fluzone" },
      { voId: "VO_0000044", ids: [6, 11], name: "FluMist" },
      { voId: "VO_0000045", ids: [3, 10], name: "Fluarix" },
      {
        voId: "VO_0004809",
        ids: [2, 9],
        name: "2008-2009 trivalent influenza vaccine",
      },
      { voId: "VO_0000642", ids: [8], name: "Influenze Virus Vaccine" },
      { voId: "VO_0000609", ids: [7], name: "viral vaccine" },
      { voId: "VO_0000315", ids: [1], name: "inactivated vaccine" },
      { voId: "VO_0000001", ids: [0], name: "vaccine" },
      { voId: "VO_0000367", ids: [5], name: "live attenuated vaccine" },
    ],
    vaccineIdsSelected: [],
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
    selectAllGenders: false,
  }),
  props: {
    biosampleMetaData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    vaccinesSelected() {
      var vaccines = [
        ...new Set(
          this.vaccineMap
            .filter((row) =>
              row.ids.some((id) => this.vaccineIdsSelected.includes(id))
            )
            .map((vaccine) => vaccine.voId)
        ),
      ];

      //reverse nested structure to select all necessary parents based on included nodes
      if (
        vaccines.includes("VO_0000047") &&
        vaccines.includes("VO_0000045") &&
        vaccines.includes("VO_0000047") &&
        vaccines.includes("VO_0000044")
      )
        vaccines.push("VO_0000642");
      if (vaccines.includes("VO_0000642")) vaccines.push("VO_0000609");
      if (
        vaccines.includes("VO_0000047") &&
        vaccines.includes("VO_0000045") &&
        vaccines.includes("VO_0000047")
      )
        vaccines.push("VO_0000315");
      if (vaccines.includes("VO_0000044")) vaccines.push("VO_0000367");
      if (
        vaccines.includes("VO_0000315") &&
        vaccines.includes("VO_0000367") &&
        vaccines.includes("VO_0000609")
      )
        vaccines.push("VO_0000001");

      return vaccines;
    },
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
      ].sort();
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
      ].sort();
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
            .map((s) => s.day_0_def_foreach)
        ),
      ].sort();
    },
    availableGenders() {
      const samples = this.biosampleMetaData.filter(
        (sample) =>
          this.vaccinesSelected.includes(
            sample.immport_immune_exposure_material_id
          ) &&
          this.selectedStudies.includes(sample.immport_study_accession) &&
          this.selectedPlatforms.includes(sample.platform_desc) &&
          this.selectedDayDefinitions.includes(sample.day_0_def_foreach)
      );
      return [...new Set(samples.map((s) => s.gender))].sort();
    },
    availableAgeGroups() {
      const samples = this.biosampleMetaData.filter(
        (sample) =>
          this.vaccinesSelected.includes(
            sample.immport_immune_exposure_material_id
          ) &&
          this.selectedStudies.includes(sample.immport_study_accession) &&
          this.selectedPlatforms.includes(sample.platform_desc) &&
          this.selectedDayDefinitions.includes(sample.day_0_def_foreach) &&
          this.selectedGenders.includes(sample.gender)
      );
      return [...new Set(samples.map((s) => s.age_group))].sort();
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
                this.selectedDayDefinitions.includes(
                  sample.day_0_def_foreach
                ) &&
                this.selectedGenders.includes(sample.gender) &&
                this.selectedAges.includes(sample.age_group)
            )
            .map((s) => s.race)
        ),
      ].sort();
    },
  },
  watch: {
    vaccineIdsSelected(newVal, oldVal) {
      //if no change in length, return
      if (newVal.length === oldVal.length) return;

      //if array grew, check for other ids to add
      if (newVal.length > oldVal.length) {
        const addedIds = newVal.filter((num) => !oldVal.includes(num));
        const otherIdsToAdd = [].concat
          .apply(
            [],
            this.vaccineMap
              .filter((vaccine) =>
                vaccine.ids.some((id) => addedIds.includes(id))
              )
              .map((vaccine) => vaccine.ids)
          )
          .filter((id) => !addedIds.includes(id));
        this.vaccineIdsSelected.push(...new Set(otherIdsToAdd));
        return;
      }

      //if array shrank, check others to remove
      const removedIds = oldVal.filter((num) => !newVal.includes(num));
      const otherIdsToRemove = [].concat
        .apply(
          [],
          this.vaccineMap
            .filter((vaccine) =>
              vaccine.ids.some((id) => removedIds.includes(id))
            )
            .map((vaccine) => vaccine.ids)
        )
        .filter((id) => !removedIds.includes(id));
      this.vaccineIdsSelected = this.vaccineIdsSelected.filter(
        (el) => !otherIdsToRemove.includes(el)
      );
    },
    availableGenders() {
      this.selectedGenders = [];
      this.selectAllGenders = false;
      if (this.availableGenders.length === 1) {
        this.selectedGenders.push(...this.availableGenders);
      }
    },
    selectAllGenders(selected) {
      if (selected)
        this.selectedGenders.push(
          ...this.availableGenders.filter(
            (gender) => !this.selectedGenders.includes(gender)
          )
        );
      else if (this.selectedGenders.length === this.availableGenders.length)
        this.selectedGenders = [];
    },
    availableAgeGroups() {
      this.selectedAges = [];
      this.selectAllAges = false;
      if (this.availableAgeGroups.length === 1) {
        this.selectedAges.push(...this.availableAgeGroups);
      }
    },
    selectAllAges(selected) {
      if (selected)
        this.selectedAges.push(
          ...this.availableAgeGroups.filter(
            (age) => !this.selectedAges.includes(age)
          )
        );
      else if (this.selectedAges.length === this.availableAgeGroups.length)
        this.selectedAges = [];
    },
    availableRaces() {
      this.selectedRaces = [];
      this.selectAllRaces = false;
      if (this.availableRaces.length === 1) {
        this.selectedRaces.push(...this.availableRaces);
      }
    },
    selectAllRaces(selected) {
      if (selected)
        this.selectedRaces.push(
          ...this.availableRaces.filter(
            (race) => !this.selectedRaces.includes(race)
          )
        );
      else if (this.selectedRaces.length === this.availableRaces.length)
        this.selectedRaces = [];
    },
    availableDayDefinitions() {
      this.selectedDayDefinitions = [];
      this.selectAllDay0Defs = false;
      if (this.availableDayDefinitions.length === 1) {
        this.selectedDayDefinitions.push(...this.availableDayDefinitions);
      }
    },
    selectAllDay0Defs(selected) {
      if (selected)
        this.selectedDayDefinitions.push(
          ...this.availableDayDefinitions.filter(
            (def) => !this.selectedDayDefinitions.includes(def)
          )
        );
      else if (
        this.selectedDayDefinitions.length ===
        this.availableDayDefinitions.length
      )
        this.selectedDayDefinitions = [];
    },
    availablePlatforms() {
      this.selectedPlatforms = [];
      this.selectAllPlatforms = false;
      if (this.availablePlatforms.length === 1) {
        this.selectedPlatforms.push(...this.availablePlatforms);
      }
    },
    selectAllPlatforms(selected) {
      if (selected)
        this.selectedPlatforms.push(
          ...this.availablePlatforms.filter(
            (platform) => !this.selectedPlatforms.includes(platform)
          )
        );
      else if (this.selectedPlatforms.length === this.availablePlatforms.length)
        this.selectedPlatforms = [];
    },
    availableStudies() {
      this.selectedStudies = [];
      this.selectAllStudies = false;
      if (this.availableStudies.length === 1) {
        this.selectedStudies.push(...this.availableStudies);
      }
    },
    selectAllStudies(selected) {
      if (selected)
        this.selectedStudies.push(
          ...this.availableStudies.filter(
            (study) => !this.selectedStudies.includes(study)
          )
        );
      else if (this.selectedStudies.length === this.availableStudies.length)
        this.selectedStudies = [];
    },
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
          this.selectedDayDefinitions.includes(sample.day_0_def_foreach) &&
          this.selectedGenders.includes(sample.gender) &&
          this.selectedAges.includes(sample.age_group)
      );
      if (biosamples.length === 0) {
        this.errormsg =
          "No biosamples could be selected based on these options. All Options must have a selection.";
        return;
      }
      this.$emit("biosamplesFilteredEvent", {
        filteredBiosamples: biosamples,
        studyVariables: {
          genders: this.selectedGenders,
          ages: this.selectedAges,
          races: this.selectedRaces,
        },
        formVariables: {
          selectedVaccines: this.vaccineMap
            .filter((vaccine) => this.vaccinesSelected.includes(vaccine.id))
            .map((vaccine) => vaccine.name),
          selectedStudies: this.selectedStudies,
          selectedPlatforms: this.selectedPlatforms,
          selectedDayDefinitions: this.selectedDayDefinitions,
          selectedGenders: this.selectedGenders,
          selectedAges: this.selectedAges,
          selectedRaces: this.selectedRaces,
        },
      });
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
.smallFont >>> label {
  font-size: 14px !important;
}
.header {
  font-size: 17px !important;
  font-weight: bold;
}
</style>