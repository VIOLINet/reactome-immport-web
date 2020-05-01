import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css"; // Add this line

Vue.use(Vuetify);
const opts = {
  theme: {
    dark: false,
  },
  options: {
    customProperties: true,
  },
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
};

export default new Vuetify(opts);