import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import xoModule from './modules/xo.module'
import userModule from './modules/user.module'

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    xoModule,
    userModule
  }
})
