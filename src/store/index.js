import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import spotify from './modules/spotify'
import ui from './modules/ui'
import trails from './modules/trails'

Vue.use(Vuex)

const { plugin } = new VuexPersistence({
  storage: window.localStorage,
  key: 'kaleidosync-persist-v7',
  reducer ({ ui, trails }) {
    return { ui, trails }
  }
})

export default new Vuex.Store({
  getters,
  modules: {
    spotify,
    ui,
    trails
  },
  plugins: [plugin]
})
