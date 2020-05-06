import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import vueCustomElement from 'vue-custom-element'
import VueCytoscape from 'vue-cytoscape'
import "document-register-element/build/document-register-element";


Vue.use(vueCustomElement)
Vue.use(VueCytoscape)
App.vuetify = vuetify
Vue.customElement('reactome-immport', App)