import { pause } from '@/util/timing'

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

export default {
  namespaced: true,
  state: {
    albumArtVisible: false,
    trackInfoVisible: false,
    hover: false,
    hoverTimeout: null,
    hoverDelay: 1200,
    spinnerVisible: false,
    hideAll: false,
    menuVisible: false,
    settingsVisible: false,
    toast: {
      visible: false,
      message: '',
      autohide: true
    }
  },
  mutations: {
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
      state.toast.forceShow = !autoHide
    },
    [SET_SPINNER_VISIBLE] (state, val) {
      state.spinnerVisible = val
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