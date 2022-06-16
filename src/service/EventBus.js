// Based on https://www.digitalocean.com/community/tutorials/vuejs-global-event-bus
// and https://v3.vuejs.org/guide/migration/events-api.html#_2-x-syntax
import Vue from 'vue';
const EventBus = new Vue();
export default EventBus