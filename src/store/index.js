import Vue from 'vue'
import Vuex from 'vuex'
import spotify from './modules/spotify'
import player from './modules/player'
import visualizer from './modules/visualizer'
import ui from './modules/ui'
import keyboard from './modules/keyboard'
import education from './modules/education'
import { composeMutations } from '@zach.winter/vue-common/util/store'
import cloneDeep from 'lodash/cloneDeep'
import initLoop from './loop'
import { detectSafari, detectMobile } from '@/util/browser'

Vue.use(Vuex)

const state = {
  loaded: false,
  isSafari: detectSafari(),
  isMobile: detectMobile()
}

export default new Vuex.Store({
  state,
  mutations: composeMutations(state),
  modules: {
    spotify,
    player,
    visualizer,
    ui,
    keyboard,
    education
  },
  actions: {
    async init ({ dispatch, commit }) {
      initLoop()
      dispatch('keyboard/init')
      await Promise.all([
        document.fonts.ready,
        dispatch('visualizer/fetchSketches')
      ])
      dispatch('visualizer/init')
      dispatch('ui/initHover')
      commit('SET_LOADED', true)
    },
  },
  getters: {
    legacy () {
      return true
    },
    activeSketch (state) {
      return cloneDeep(state.visualizer.sketches.find(({ _id: id }) => state.visualizer.activeSketchId === id))
    },
    activeSketchIndex (state) {
      const sketch = state.visualizer.sketches.find(({ _id }) => _id === state.visualizer.activeSketchId)
      return state.visualizer.sketches.indexOf(sketch)
    }
  }
})