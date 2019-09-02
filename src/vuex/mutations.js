import {
  SET_MENU_VISIBLE,
  SET_VISUALIZER,
  SET_ALBUM_ART_VISIBLE,
  SET_TRACK_INFO_VISIBLE,
  SET_ALWAYS_SHOW_TRACK_INFO,
  SET_ALWAYS_SHOW_ALBUM_ART,
  SET_HOVER,
  SET_TOAST_VISIBLE,
  SET_COLOR,
  SET_SPINNER_VISIBLE,
  SET_CURRENTLY_PLAYING,
  SET_HIDE_ALL,
  SET_HOVER_TIMEOUT,
  SET_TOAST_MESSAGE
} from './mutation-types'

export default {
  [SET_HIDE_ALL] (state, val) {
    state.hideAll = val
  },
  [SET_HOVER_TIMEOUT] (state, method) {
    clearTimeout(state.hoverTimeout)
    state.hoverTimeout = setTimeout(() => {
      method(state)
    }, state.hoverDelay)
  },
  [SET_ALWAYS_SHOW_ALBUM_ART] (state, val) {
    state.alwaysShowAlbumArt = val
  },
  [SET_ALWAYS_SHOW_TRACK_INFO] (state, val) {
    state.alwaysShowTrackInfo = val
  },
  [SET_ALBUM_ART_VISIBLE] (state, val) {
    state.albumArtVisible = val
  },
  [SET_TRACK_INFO_VISIBLE] (state, val) {
    state.trackInfoVisible = val
  },
  [SET_MENU_VISIBLE] (state, val) {
    state.menuVisible = val
  },
  [SET_HOVER] (state, val) {
    state.hover = val
    document.body.style.cursor = (val === true)
      ? 'default'
      : 'none'
  },
  [SET_SPINNER_VISIBLE] (state, val) {
    state.spinnerVisible = val
  },
  [SET_CURRENTLY_PLAYING] (state, val) {
    state.currentlyPlaying = val
  },
  [SET_COLOR] (state, [r, g, b]) {
    state.color = `rgb(${r},${g},${b})`
  },
  [SET_TOAST_VISIBLE] (state, val) {
    state.toast.visible = val
  },
  [SET_TOAST_MESSAGE] (state, { message, autoHide }) {
    state.toast.message = message
    state.toast.autoHide = autoHide
  },
  [SET_VISUALIZER] (state, val) {
    state.selectedVisualizer = val
  }
}