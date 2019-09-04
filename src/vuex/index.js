import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import Actions from './actions'
import Mutations from './mutations'

Vue.use(Vuex)

const { plugin } = new VuexPersistence({
  storage: window.localStorage,
  key: 'kaleidosync-persist',
  reducer ({ alwaysShowAlbumArt, alwaysShowTrackInfo, selectedVisualizer }) {
    return {
      alwaysShowAlbumArt,
      alwaysShowTrackInfo,
      selectedVisualizer
    }
  }
})

export default new Vuex.Store({
  state: {
    alwaysShowAlbumArt: false,
    alwaysShowTrackInfo: false,
    albumArtVisible: false,
    trackInfoVisible: false,
    hideAll: false,
    trackProgress: {
      progress: 0,
      duration: 0,
      percent: 100
    },
    colorTransitionDuration: 1000,
    hoverTimeout: 0,
    hoverTimestamp: 0,
    hoverDelay: 1000,
    shadeVisible: true,
    menuVisible: false,
    settingsVisible: false,
    hover: false,
    spinnerVisible: false,
    slowerSpeed: false, 
    color: 'rgba(0,0,0,.5)',
    colorScheme: {},
    currentlyPlaying: {},
    selectedVisualizer: 'trails',
    toast: {
      visible: false,
      message: '',
      autohide: true
    }
  },
  mutations: Mutations,
  actions: Actions,
  plugins: [plugin]
})
