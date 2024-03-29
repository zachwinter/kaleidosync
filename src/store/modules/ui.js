import { buildModule } from '@zach.winter/vue-common/util/store'
import { setting, types } from '@/util/settings'

const autohideToolbar = setting('autohideToolbar', true, types.boolean);

const state = {
  fullScreen: false,
  hideAll: false,
  showControlBar: true,
  sketchSelectorVisible: false,
  showSideBar: false,
  navigatorIndex: 0,
  get autohideToolbar() { return autohideToolbar.get() },
  set autohideToolbar(value) { autohideToolbar.set(value) },
  editingUniform: false,
  uniformTimeout: null,
  uniform: null
}

const actions = {
  toggleFullScreen ({ commit, state }) {
    if (state.fullScreen) {
      commit('SET_FULL_SCREEN', false)
      document.exitFullscreen()
    } else {
      commit('SET_FULL_SCREEN', true)
      document.body.requestFullscreen()
    }
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
  },
  uniformEdit ({ commit, state }, name) {
    // if (!rootState.isMobile) return
    commit('SET_EDITING_UNIFORM', true)
    commit('SET_UNIFORM', name)
    clearTimeout(state.uniformTimeout)
    commit('SET_UNIFORM_TIMEOUT', setTimeout(() => {
      commit('SET_EDITING_UNIFORM', false)
      commit('SET_UNIFORM_TIMEOUT', null)
      setTimeout(() => {
        commit('SET_UNIFORM', null)
      }, 300)
    }, 300))
  }
}

export default buildModule({ state, actions })