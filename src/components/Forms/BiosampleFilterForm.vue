<template>
  <v-container fluid>
    <v-row class="text-left">
      <v-col>
        <v-sheet color="grey lighten-2" class="pa-2 scrollable" height="24.5em"
          ><v-treeview
            dense
            open-all
            selectable
            hoverable
            activatable
            selection-type="independent"
            v-model="vaccineIdsSelected"
            :items="vaccineHierarchy"
            class="smallFont"
          >
          <!-- Based on https://stackoverflow.com/questions/54719453/how-to-bind-an-event-to-a-treeview-node-in-vuetify/54719701 -->
          <template slot="label" slot-scope="{ item }">
            <div>
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{on, attrs}">
                  <a 
                    target="_ontobee"
                    :href="'http://purl.obolibrary.org/obo/' + item.voId"
                    v-bind="attrs" 
                    v-on="on">
                    {{ item.name }}
                  </a>
                </template>
                Open Ontobee for {{item.name}}
              </v-tooltip>
            </div>
          </template>
          </v-treeview>
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet color="grey lighten-2" class="pa-2 ma-1 inputBox">
          <p class="header">ImmPort Studies</p>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableStudies.length > 1"
            label="Select All"
            :value="selectAllStudies"
            :input-value="selectAllStudies"
            v-model="selectAllStudies"
          ></v-checkbox>
          <!-- Don't disable the following checkbox when there is only one study. Otherwise,
           the link provided in the template is disabled -->
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(def, index) in availableStudies"
            :key="index"
            v-model="selectedStudies"
            :value="def"
            @click="selectAllStudies = false"
          >
          <!-- The following code is based on https://vuetifyjs.com/en/components/checkboxes/#inline-text-field -->
          <template v-slot:label>
            <div>
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{on}">
                  <a target="_immport"
                     :href="'https://www.immport.org/shared/study/' + def"
                    @click.stop
                    v-on="on">{{def}}
                  </a>
                </template>
              Open Immport for {{def}}
              </v-tooltip>
            </div>
          </template>
          </v-checkbox>
        </v-sheet>
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
      <v-col>
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
      <v-col>
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
      <v-col>
        <!-- Following the same height as the first one. This is hard-coded! - NB by GW -->
        <v-sheet color="grey lighten-2" class="pa-2 scrollable" height="24.5em">
          <p class="header">Cell Type</p>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-if="availableType_subtypes.length > 1"
            label="Select All"
            :value="selectAllType_subtypes"
            :input-value="selectAllType_subtypes"
            v-model="selectAllType_subtypes"
          ></v-checkbox>
          <v-checkbox
            dense
            class="shrink ma-0 pa-0 smallFont"
            v-for="(tst, index) in availableType_subtypes"
            :key="index"
            :disabled="availableType_subtypes.length === 1 ? true : false"
            v-model="selectedType_subtypes"
            :label="tst"
            :value="tst"
            @click="selectAllType_subtypes = false"
          ></v-checkbox>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" md="8" class="text-right">
        <span style="color: red" class="mr-5">{{ errormsg }}</span>
        <v-btn color="tertiary" class="mr-2" @click="clearVOForm">Clear</v-btn>
        <v-btn color="primary" @click="filterBiosamples">Next</v-btn>
      </v-col>
    </v-row>
  </v-container>
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
              name: "inactivated influenza vaccine",
              id: 52,
              voId: "VO_0001176",
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
              {
                name: "2011-2012 trivalent inactivated vaccine...",
                // name: "2011?2012 trivalent inactivated vaccine (A/California/7/09/ (H1N1,) A/Perth /16/2009 (H3N2), and B/Brisbane /60/2008)",
                id: 5,
                voId: "VO_0004810"
              },
              {
                name: "Fluvirin",
                id: 9,
                voId: "VO_0000046",
              },
              ],
              },
          ],
          },
          {
            name: "live attenuated vaccine",
            id: 6,
            voId: "VO_0000367",
            children: [
              {
                name: "live attenuated influenza vaccine",
                id: 7,
                voId: "VO_0001178",
                children: [
                  {
                    name: "FluMist",
                     id: 8,
                    voId: "VO_0000044",
                  },
                ]
              },
              {
                name: "YF-Vax",
                id: 10,
                voId: "VO_0000121",
              },
              {
                name: "Zostavax",
                id: 11,
                voId: "VO_0000124",
              }
            ]
          },
          {
            name: "conjugate vaccine",
            id: 12,
            voId: "VO_0000195",
            children: [
              {
                name: "Menactra",
                id: 13,
                voId: "VO_0000071",
              },
              { 
                name: "Pnemovax 23",
                id: 14,
                voId: "VO_0000088",
              },
              { 
                name: "Menveo",
                id: 15,
                voId: "VO_0001246",
              }             
            ]
          },
          {
            name: "recombinant viral vector vaccine",
            id: 16,
            voId: "VO_0005331",
            children: [
              {
                name: "Menactra",
                id: 17,
                voId: "VO_0000071",
              },
              { 
              name: "MVA85A",
              id: 18,
              voId: "VO_0003120",
              },
              {
                name: "MRKAd5 HIV-1 gag/pol/nef",
                id: 19,
                voId: "VO_0003133",
              }       
            ]
          },
          {
            name: "subunit vaccine",
            id: 20,
            void: "VO_0000534",
            children:  [
                {
                name: "ACWY Vax",
                id: 21,
                voId: "VO_0003138", 
                }
            ]
          },
          {
            name: "viral vaccine",
            id: 22,
            voId: "VO_0000609",
            children: [
              {
                name: "Influenza Virus Vaccine",
                id: 23,
                voId: "VO_0000642",
                children: [
                  {
                    name: "inactivated influenza vaccine",
                    id: 51,
                    voId: "VO_0001176",
                    children: [
                      {
                        name: "2008-2009 trivalent influenza vaccine",
                        id: 24,
                        voId: "VO_0004809",
                      },
                      {
                        name: "Fluarix",
                        id: 25,
                        voId: "VO_0000045",
                      },
                      {
                        name: "Fluzone",
                        id: 26,
                        voId: "VO_0000047",
                      },
                      {
                        name: "2011-2012 trivalent inactivated vaccine...",
                        // name: "2011?2012 trivalent inactivated vaccine (A/California/7/09/ (H1N1,) A/Perth /16/2009 (H3N2), and B/Brisbane /60/2008)",
                        id: 27,
                        voId: "VO_0004810"
                      },
                      {
                        name: "Fluvirin",
                        id: 30,
                        voId: "VO_0000046",
                      },
                    ]
                  },
                  {            	
                    name: "live attenuated influenza vaccine",
                    id: 28,
                    voId: "VO_0001178",
                    children: [
                      {
                        name: "FluMist",
                        id: 29,
                        voId: "VO_0000044",
                      },
                    ]
                  }
                ]
              },
              {
                name: "Yellow Fever Virus Vaccine",
                id: 31,
                voId: "VO_0000123",
                children: [
                  {
                    name: "YF-Vax",
                    id: 32,
                    voId: "VO_0000121",
                  },
                  {
                    name: "Stamaril",
                    id: 33,
                    voId: "VO_0003139",
                  },
                  {
                    name: "Yellow fever 17D vaccine vector",
                    id: 34,
                    voId: "VO_0000122"
                  }, 
                ],
              },
              {
                name: "Varicella-Zoster Virus Vaccine",
                id: 35,
                voId: "VO_0000669",
                children: [
                  {
                    name: "Zostavax",
                    id: 36,
                    voId: "VO_0000124",
                  },
                ],
              },
              {
                name: "HIV Virus Vaccine",
                id: 37,
                voId: "VO_0000295",
                children: [
                  {
                    name: "MRKAd5 HIV-1 gag/pol/nef",
                    id: 38,
                    voId: "VO_0003133",
                  },
                ],
              },
            ],
          },
          {
            name: 'bacterial vaccine',
            id: 39,
            voId: "VO_0000165",
            children: [
              {
                name: "Neisseria meningitidis vaccine",
                id: 40,
                voId: "VO_0000053", 
                children: [
                  { 
                    name: 'Menactra',
                    id: 41,
                    voId: "VO_0000071"
                    },
                  {
                    name: "ACWY Vax",
                    id: 42,
                    voId: "VO_0003138", 
                  },
                  {
                    name: "Menveo",
                    id: 43,
                    voId: "VO_0001246", 
                  },
                  {
                    name: "Meningococcal Polysaccharide Vaccine...",
                    id: 44,
                    voId: "VO_0010725", 
                  },
                ]
              },
              {
                name: "Streptoccoal pneumoniae vaccine",
                id: 45,
                voId: "VO_0000675",
                children: [
                  {
                    name: "Pneumovax 23 (USA)",
                    id: 46,
                    voId: "VO_0000088",
                  },
                ],
              },
              {
                name: "Mycobacterium tuberculosis vaccine",
                id: 47,
                voId: "VO_0000072",
                children: [
                  {
                    name: "MVA85A",
                    id: 48,
                    voId: "VO_0003120",
                  },
                ],
              },
            ]
          },
          {
            name: "malarial vaccine",
            id: 49,
            voId: "VO_0000761",
            children: [
              {
                name: "Plasmodium flaciparum vaccine",
                id: 50,
                voId: "VO_0000087"
              }
            ]
          }  
        ]
      }
    ],
    vaccineIdsSelected: [],
    selectedGenders: [],
    selectedAges: [],
    selectedRaces: [],
    selectedDayDefinitions: [],
    selectedPlatforms: [],
    selectedStudies: [],
    selectedType_subtypes: [],
    filteredBiosampleMetaData: [],
    errormsg: "",
    selectAllStudies: false,
    selectAllPlatforms: false,
    selectAllDay0Defs: false,
    selectAllRaces: false,
    selectAllAges: false,
    selectAllGenders: false,
    selectAllType_subtypes: false,
  }),
  props: {
    biosampleMetaData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    vaccineMap() {
      // Basically try to traversal the tree
      let void2vaccine = new Map()
      let current = new Array()
      current.push(this.vaccineHierarchy[0])
      let next = new Array()  
      while (current.length > 0) {
        for (let i = 0; i < current.length; i++) {
          let temp = current[i]
          let vaccine = void2vaccine.get(temp.voId)
          if (vaccine === undefined) {
            vaccine = {}
            vaccine.name = temp.name
            vaccine.ids = [temp.id]
            vaccine.voId = temp.voId
            void2vaccine.set(vaccine.voId, vaccine)
          }
          else {
            vaccine.ids.push(temp.id)
          }
          if (temp.children !== undefined) {
            next.push.apply(next, temp.children)
          }
        }
        // Clear the current array
        current.length = 0
        current.push.apply(current, next)
        next.length = 0
      }
      return [...new Set(void2vaccine.values())]
    },
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

      // //reverse nested structure to select all necessary parents based on included nodes
      // //since these parents have their own data provided in the sample meta file.
      // // Since only leaf can be selected (configured above for the v-tree), we need to do this
      // // reverse search!
      // if (
      //   vaccines.includes("VO_0000047") &&
      //   vaccines.includes("VO_0000045") &&
      //   vaccines.includes("VO_0000047") &&
      //   vaccines.includes("VO_0000044")
      // )
      //   vaccines.push("VO_0000642");
      // if (vaccines.includes("VO_0000642")) vaccines.push("VO_0000609");
      // if (
      //   vaccines.includes("VO_0000047") &&
      //   vaccines.includes("VO_0000045") &&
      //   vaccines.includes("VO_0000047")
      // )
      //   vaccines.push("VO_0000315");
      // if (vaccines.includes("VO_0000044")) 
      //   vaccines.push("VO_0001178");
      // if (
      //   vaccines.includes("VO_0000315") &&
      //   vaccines.includes("VO_0000367") &&
      //   vaccines.includes("VO_0000609")
      // )
      //   vaccines.push("VO_0000001");
      // if (vaccines.includes("VO_0000087"))
      //   vaccines.push("VO_0000761")

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
            .map((s) => s.day_0_def)
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
          this.selectedDayDefinitions.includes(sample.day_0_def)
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
          this.selectedDayDefinitions.includes(sample.day_0_def) &&
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
                  sample.day_0_def
                ) &&
                this.selectedGenders.includes(sample.gender) &&
                this.selectedAges.includes(sample.age_group)
            )
            .map((s) => s.race)
        ),
      ].sort();
    },
    availableType_subtypes() {
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
                  sample.day_0_def
                ) &&
                this.selectedGenders.includes(sample.gender) &&
                this.selectedAges.includes(sample.age_group) &&
                this.selectedRaces.includes(sample.race)
            )
            .map((s) => s.type_subtype)
        ),
      ];
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
    availableType_subtypes() {
      this.selectedType_subtypes = [];
      this.selectAllType_subtypes = false;
      if (this.availableType_subtypes.length === 1)
        this.selectedType_subtypes.push(...this.availableType_subtypes);
    },
    selectAllType_subtypes(selected) {
      if (selected)
        this.selectedType_subtypes.push(
          ...this.availableType_subtypes.filter(
            (tst) => !this.selectedType_subtypes.includes(tst)
          )
        );
        else if(this.selectedType_subtypes.length === this.availableType_subtypes.length)
          this.selectedType_subtypes = [];
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
          this.selectedDayDefinitions.includes(sample.day_0_def) &&
          this.selectedGenders.includes(sample.gender) &&
          this.selectedAges.includes(sample.age_group) &&
          this.selectedRaces.includes(sample.race) &&
          this.selectedType_subtypes.includes(sample.type_subtype)
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
            .filter((vaccine) => this.vaccinesSelected.includes(vaccine.voId))
            .map((vaccine) => vaccine.name),
          selectedStudies: this.selectedStudies,
          selectedPlatforms: this.selectedPlatforms,
          selectedDayDefinitions: this.selectedDayDefinitions,
          selectedGenders: this.selectedGenders,
          selectedAges: this.selectedAges,
          selectedRaces: this.selectedRaces,
          selectedType_subtypes: this.selectedType_subtypes
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