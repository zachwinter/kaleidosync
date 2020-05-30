import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import getters from './getters'
import spotify from './modules/spotify'
import ui from './modules/ui'
import trails from './modules/trails'
import user from './modules/user'

Vue.use(Vuex)

const { plugin } = new VuexPersistence({
  storage: window.localStorage,
  key: 'kaleidosync-persist-v10',
  reducer ({ user, trails }) {
    return { user, trails }
  }
})

export default new Vuex.Store({
  getters,
  modules: {
    spotify,
    ui,
    trails,
    user
  },
  plugins: [plugin]
})
