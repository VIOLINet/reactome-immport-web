import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import vueCustomElement from 'vue-custom-element'
import VueCytoscape from 'vue-cytoscape'

Vue.use(vueCustomElement)
Vue.use(VueCytoscape)
App.vuetify = vuetify
Vue.customElement('reactome-immport-enrichment-form', App)