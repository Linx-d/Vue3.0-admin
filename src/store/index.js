import Vue from 'vue'
import Vuex from 'vuex'
import map from "./map"
import corporation from "./corporation"

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    map,
    corporation
  }
})
