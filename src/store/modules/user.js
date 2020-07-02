export const SET_ALWAYS_SHOW_ALBUM_ART = 'SET_ALWAYS_SHOW_ALBUM_ART'
export const SET_ALWAYS_SHOW_TRACK_INFO = 'SET_ALWAYS_SHOW_TRACK_INFO'
export const SET_SELECTED_VISUALIZER = 'SET_SELECTED_VISUALIZER'
export const SET_EDUCATED = 'SET_EDUCATED'
export const SET_SHOW_SHADER = 'SET_SHOW_SHADER'
export const SET_SHOW_SETTINGS = 'SET_SHOW_SETTINGS'

export default {
  namespaced: true,
  state: {
    alwaysShowAlbumArt: false,
    alwaysShowTrackInfo: false,
    selectedVisualizer: 'orbs',
    educated: false,
    showShader: false,
    showSettings: false
  },
  mutations: {
    [SET_ALWAYS_SHOW_TRACK_INFO] (state, val) {
      state.alwaysShowTrackInfo = val
    },
    [SET_ALWAYS_SHOW_ALBUM_ART] (state, val) {
      state.alwaysShowAlbumArt = val
    },
    [SET_SELECTED_VISUALIZER] (state, val) {
      state.selectedVisualizer = val
    },
    [SET_EDUCATED] (state, val) {
      state.educated = val
    },
    [SET_SHOW_SHADER] (state, val) {
      state.showShader = val
    },
    [SET_SHOW_SETTINGS] (state, val) {
      state.showSettings = val
    }
  },
  actions: {
    toggleSettings ({ state, commit }) {
      commit(SET_SHOW_SETTINGS, !state.showSettings)
    }
  }
}