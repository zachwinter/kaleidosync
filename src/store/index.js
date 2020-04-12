import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import spotify from './modules/spotify'
import ui from './modules/ui'
import fractal from './modules/fractal'
import trails from './modules/trails'
import gloop from './modules/gloop'
import flower from './modules/flower'

Vue.use(Vuex)

const { plugin } = new VuexPersistence({
  storage: window.localStorage,
  key: 'kaleidosync-persist-v5',
  reducer ({ ui }) {
    return { ui }
  }
})

export default new Vuex.Store({
  getters,
  modules: {
    spotify,
    ui,
    fractal,
    trails,
    gloop,
    flower
  },
  plugins: [plugin]
})
