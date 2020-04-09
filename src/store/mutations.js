import {
  SET_AUTH_ID,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
  SET_REFRESH_CODE,
  SET_CURRENTLY_PLAYING,
  SET_TRACK_ANALYSIS,
  SET_TRACK_FEATURES,
  SET_INITIAL_TRACK_PROGRESS,
  SET_TRACK_PROGRESS,
  SET_INITIAL_START,
  SET_ACTIVE,
  SET_NO_PLAYBACK,
  SET_INITIALIZED,
  SET_LOADING_NEXT_SONG,
  SET_TRAILS,
  SET_TRAILS_BACKGROUND,
  SET_SELECTED_VISUALIZER,
  SET_VOLUME_QUEUES,
  SET_ACTIVE_INTERVAL,
  SET_ALWAYS_SHOW_ALBUM_ART,
  SET_ALWAYS_SHOW_TRACK_INFO,
  SET_HOVER,
  SET_HOVER_DELAY,
  SET_MENU_VISIBLE,
  SET_TRACK_INFO_VISIBLE,
  SET_ALBUM_ART_VISIBLE,
  SET_HIDE_ALL,
  SET_TOAST_MESSAGE,
  SET_TOAST_VISIBLE,
  SET_SPINNER_VISIBLE,
  SET_HOVER_TIMEOUT,
  SET_BEAT_INTERVAL
} from './mutation-types'

export default {
  [SET_AUTH_ID] (state, val) {
    state.api.authID = val
  },
  [SET_ACCESS_TOKEN] (state, val) {
    state.api.accessToken = val
    state.api.headers = {
      'Authorization': 'Bearer ' + val,
      'Accept': 'application/json'
    }
  },
  [SET_REFRESH_TOKEN] (state, val) {
    state.api.refreshToken = val
  },
  [SET_REFRESH_CODE] (state, val) {
    state.api.refreshCode = val
  },
  [SET_CURRENTLY_PLAYING] (state, val) {
    state.currentlyPlaying = val
  },
  [SET_TRACK_ANALYSIS] (state, val) {
    state.trackAnalysis = val
  },
  [SET_TRACK_FEATURES] (state, val) {
    state.trackFeatures = val
  },
  [SET_INITIAL_TRACK_PROGRESS] (state, val) {
    state.initialTrackProgress = val
  },
  [SET_TRACK_PROGRESS] (state, val) {
    state.trackProgress = val
  },
  [SET_INITIAL_START] (state, val) {
    state.initialStart = val
  },
  [SET_ACTIVE] (state, val) {
    state.active = val
  },
  [SET_NO_PLAYBACK] (state, val) {
    state.noPlayback = val
  },
  [SET_INITIALIZED] (state, val) {
    state.initialized = val
  },
  [SET_LOADING_NEXT_SONG] (state, val) {
    state.loadingNextSong = val
  },
  [SET_TRAILS] (state, val) {
    state.trails = val
  },
  [SET_TRAILS_BACKGROUND] (state, val) {
    state.trailsBackground = val
  },
  [SET_SELECTED_VISUALIZER] (state, val) {
    state.selectedVisualizer = val
  },
  [SET_VOLUME_QUEUES] (state, val) {
    state.volumeQueues = val
  },
  [SET_ACTIVE_INTERVAL] (state, { type, interval }) {
    state.activeIntervals[type] = interval
  },
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
  [SET_TOAST_MESSAGE] (state, { message, autoHide }) {
    state.toast.message = message
    state.toast.autoHide = autoHide
  },
  [SET_SPINNER_VISIBLE] (state, val) {
    state.spinnerVisible = val
  },
  [SET_BEAT_INTERVAL] (state, val) {
    state.beatInterval = val
  }
}