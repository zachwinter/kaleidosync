import { buildModule } from '@zach.winter/vue-common/util/store'

const state = {
  fullScreen: false,
  devMode: false,
  hideAll: false,
  showControlBar: true,
  sketchSelectorVisible: false,
  showSideBar: false,
  navigatorIndex: 0,
  autohideToolbar: true
}

const actions = {
  fullScreen ({ commit }) {
    commit('SET_FULL_SCREEN', true)
    document.body.requestFullscreen()
  },
  toggleSketchSelector ({ commit, state }) {
    commit('SET_SKETCH_SELECTOR_VISIBLE', !state.sketchSelectorVisible)
  },
  toggleSideBar ({ commit, state }) {
    commit('SET_SHOW_SIDE_BAR', !state.showSideBar)
  },
  navBack ({ state, commit }) {
    if (state.navigatorIndex === 0) return
    commit('SET_NAVIGATOR_INDEX', state.navigatorIndex - 1)
  },
  navForward ({ commit }) {
    commit('SET_NAVIGATOR_INDEX', state.navigatorIndex + 1)
  },
  initHover () {
    document.body.addEventListener('mousemove', () => {
      window.__KALEIDOSYNC_LOOP__.hover = true
      document.body.style.cursor = 'default'
      clearTimeout(window.__KALEIDOSYNC_LOOP__.hoverTimeout)
      window.__KALEIDOSYNC_LOOP__.hoverTimeout = setTimeout(() => {
        window.__KALEIDOSYNC_LOOP__.hover = false
      }, 2000)
    })
  }
}

export default buildModule({ state, actions })