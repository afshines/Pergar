import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    rtl: true,
      theme: {
          themes: {
            light: {
              primary: '#262d65',
              secondary: '#e8bea8',
              accent: '#3A7AFA',
            },
          },
      }
  });
  