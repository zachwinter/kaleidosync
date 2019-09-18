import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import Actions from './actions'
import Mutations from './mutations'

Vue.use(Vuex)

const { plugin } = new VuexPersistence({
  storage: window.localStorage,
  key: 'kaleidosync-persist-v2',
  reducer ({ alwaysShowAlbumArt, alwaysShowTrackInfo, selectedVisualizer, visualizers }) {
    return {
      alwaysShowAlbumArt,
      alwaysShowTrackInfo,
      selectedVisualizer,
      visualizers
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
    },
    visualizers: {
      trails: {
        SIDES: {
          MIN: 3,
          MAX: 12,
          INITIAL: 6,
          VALUE: 6,
          STEP: 1
        },
        TRAIL_LENGTH: {
          MIN: 7,
          MAX: 25,
          INITIAL: 17,
          VALUE: 17,
          STEP: 1
        },
        ROTATION_CONSTANT: {
          MIN: 1,
          MAX: 15,
          INITIAL: 9.5,
          VALUE: 9.5,
          STEP: .25
        },
        ROTATION_MULTIPLIER: {
          MIN: 1,
          MAX: 1.1,
          INITIAL: 1,
          VALUE: 1,
          STEP: .001
        },
        WIDTH_CONSTANT: {
          MIN: .01,
          MAX: .1,
          INITIAL: 0.09,
          VALUE: 0.09,
          STEP: .001
        },
        GLOW_WIDTH: {
          MIN: 20,
          MAX: 100,
          INITIAL: 40,
          VALUE: 40,
          STEP: 1
        },
        SMEAR: {
          MIN: .1,
          MAX: .9,
          INITIAL: 0.7,
          VALUE: .7,
          STEP: 0.05
        },
        BACKGROUND_COLOR: {
          INITIAL: { rgba: { r: 12, g: 8, b: 50 } },
          VALUE: { rgba: { r: 12, g: 8, b: 50 } }
        },
        GLOW_COLOR: {
          INITIAL: { rgba: { r: 48, g: 153, b: 255 } },
          VALUE: { rgba: { r: 48, g: 153, b: 255 } }
        }
      }
    }
  },
  mutations: Mutations,
  actions: Actions,
  plugins: [plugin]
})
