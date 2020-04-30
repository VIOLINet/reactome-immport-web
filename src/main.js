import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import vueCustomElement from 'vue-custom-element'

Vue.use(vueCustomElement)
App.vuetify = vuetify
Vue.customElement('reactome-immport-enrichment-form', App)