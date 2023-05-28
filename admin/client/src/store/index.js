import Vue from 'vue'
import Vuex from 'vuex'

import authentication from './modules/auth/authentication'
import news from './modules/news'
import media from './modules/media'
import rss from './modules/rss'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  
    authentication,
    media,
    news,
    rss
  }
})
