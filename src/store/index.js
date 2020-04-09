import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import mutations from './mutations'
import actions from './actions'
import state from './state'

Vue.use(Vuex)

const { plugin } = new VuexPersistence({
  storage: window.localStorage,
  key: 'kaleidosync-persist-v3',
  reducer (state) {
    const {
      alwaysShowAlbumArt,
      alwaysShowTrackInfo,
      selectedVisualizer,
      trails,
      trailsBackground
    } = state

    return {
      alwaysShowAlbumArt,
      alwaysShowTrackInfo,
      selectedVisualizer,
      trails,
      trailsBackground
    }
  }
})

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [plugin]
})
