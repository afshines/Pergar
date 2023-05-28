import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import router from './router'
import store from './store'

import VueAWN from "vue-awesome-notifications";



Vue.config.productionTip = false;
const options = {
  labels: {
    success: "موفقیت",
    alert: "خطا",
    async: "درحال انتقال ...",
  },
};
Vue.use(VueAWN, options);


// createApp(App)
//   .use(vuetify)
//   .mount('#app')



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')