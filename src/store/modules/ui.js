import { pause } from '@/util/timing'

export const SET_ALWAYS_SHOW_ALBUM_ART = 'SET_ALWAYS_SHOW_ALBUM_ART'
export const SET_ALWAYS_SHOW_TRACK_INFO = 'SET_ALWAYS_SHOW_TRACK_INFO'
export const SET_MENU_VISIBLE = 'SET_MENU_VISIBLE'
export const SET_HOVER = 'SET_HOVER'
export const SET_HOVER_TIMEOUT = 'SET_HOVER_TIMEOUT'
export const SET_HOVER_DELAY = 'SET_HOVER_DELAY'
export const SET_ALBUM_ART_VISIBLE = 'SET_ALBUM_ART_VISIBLE'
export const SET_TRACK_INFO_VISIBLE = 'SET_TRACK_INFO_VISIBLE'
export const SET_HIDE_ALL = 'SET_HIDE_ALL'
export const SET_TOAST_VISIBLE = 'SET_TOAST_VISIBLE'
export const SET_TOAST_MESSAGE = 'SET_TOAST_MESSAGE'
export const SET_SPINNER_VISIBLE = 'SET_SPINNER_VISIBLE'
export const SET_SELECTED_VISUALIZER = 'SET_SELECTED_VISUALIZER'
export const SET_EDUCATED = 'SET_EDUCATED'

export default {
  namespaced: true,
  state: {
    alwaysShowAlbumArt: false,
    alwaysShowTrackInfo: false,
    albumArtVisible: false,
    trackInfoVisible: false,
    hover: false,
    hoverTimeout: null,
    hoverDelay: 2000,
    spinnerVisible: false,
    hideAll: false,
    menuVisible: false,
    settingsVisible: false,
    toast: {
      visible: false,
      message: '',
      autohide: true
    },
    selectedVisualizer: 'fractal',
    educated: false
  },
  mutations: {
    [SET_ALWAYS_SHOW_TRACK_INFO] (state, val) {
      state.alwaysShowTrackInfo = val
    },
    [SET_ALWAYS_SHOW_ALBUM_ART] (state, val) {
      state.alwaysShowAlbumArt = val
    },
    [SET_HOVER] (state, val) {
      state.hover = val
    },
    [SET_HOVER_TIMEOUT] (state, method) {
      clearTimeout(state.hoverTimeout)
      state.hoverTimeout = setTimeout(() => {
        method(state)
      }, state.hoverDelay)
    },
    [SET_HOVER_DELAY] (state, val) {
      state.hoverDelay = val
    },
    [SET_MENU_VISIBLE] (state, val) {
      state.menuVisible = val
    },
    [SET_TRACK_INFO_VISIBLE] (state, val) {
      state.trackInfoVisible = val
    },
    [SET_ALBUM_ART_VISIBLE] (state, val) {
      state.albumArtVisible = val
    },
    [SET_HIDE_ALL] (state, val) {
      state.hideAll = val
    },
    [SET_TOAST_VISIBLE] (state, val) {
      state.toast.visible = val
    },
    [SET_TOAST_MESSAGE] (state, { message, autoHide, subText }) {
      state.toast.message = message
      state.toast.autoHide = autoHide
      state.toast.subText = subText
    },
    [SET_SPINNER_VISIBLE] (state, val) {
      state.spinnerVisible = val
    },
    [SET_SELECTED_VISUALIZER] (state, val) {
      state.selectedVisualizer = val
    },
    [SET_EDUCATED] (state, val) {
      state.educated = val
    }
  },

  actions: {
    hover ({ commit }) {
      commit(SET_HOVER, true)
      commit(SET_HOVER_TIMEOUT, state => {
        if (state.settingsVisible === false) {
          commit(SET_HOVER, false)
        }
      }) 
    },
  
    async toast ({ commit, state }, { message, subText = null, autoHide = true }) {
      if (state.toast.visible) {
        commit(SET_TOAST_VISIBLE, false)
        await pause(500)
      }
      commit(SET_TOAST_MESSAGE, { message, autoHide, subText })
      commit(SET_TOAST_VISIBLE, true)
    },

    resetToast ({ commit }) {
      commit(SET_TOAST_MESSAGE, { message: '', autoHide: true, subText: '' })
    }
  }
}