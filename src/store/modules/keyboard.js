import { buildModule } from '@zach.winter/vue-common/util/store'

const state = {
  super: false,
  escape: 0,
  enter: 0,
  left: 0,
  right: 0
}

const actions = {
  init ({ commit, dispatch, rootState, state }) {
    window.addEventListener('keydown', e => {
      if (rootState.visualizer.devMode) return

      if (e.key === 'v') {
        dispatch('ui/toggleSketchSelector', null, { root: true })
      }

      if (e.key === 'c') {
        dispatch('ui/toggleSideBar', null, { root: true })
      }

      if (e.key === 'f') {
        dispatch('ui/toggleFullScreen', null, { root: true })
      }

      if (e.key === 'b') {
        dispatch('player/toggleBeatInterval', null, { root: true })
      }

      if (e.key === 's') {
        dispatch('player/toggleShuffle', null, { root: true })
      }

      if (e.key === 'Enter') {
        commit('SET_ENTER', state.enter + 1)
        if (rootState.ui.sketchSelectorVisible) {
          return commit('ui/SET_SKETCH_SELECTOR_VISIBLE', false, { root: true })
        }
      }

      if (e.key === 'Escape') {
        commit('SET_ESCAPE', state.escape + 1)
        commit('ui/SET_FULL_SCREEN', false, { root: true })
        if (rootState.ui.sketchSelectorVisible) {
          commit('ui/SET_SKETCH_SELECTOR_VISIBLE', false, { root: true })
        }
      }

      if (e.key === 'ArrowLeft') commit('SET_LEFT', state.left + 1)
      if (e.key === 'ArrowRight') commit('SET_RIGHT', state.right + 1)
    }, true)

    window.addEventListener('keyup', ({ key }) => {
      if (rootState.visualizer.devMode) return
      if (key === 'Meta') commit('SET_SUPER', false)
    }, true)
  },

  async determineCommand ({ dispatch }, e) {
    switch (e.key) {
      case '1':
        e.preventDefault()
        dispatch('editor/selectTab', 0, { root: true })
        return
      case '2':
        e.preventDefault()
        dispatch('editor/selectTab', 1, { root: true })
        return
      case '3':
        e.preventDefault()
        dispatch('editor/selectTab', 2, { root: true })
        return
      case '4':
        e.preventDefault()
        dispatch('editor/selectTab', 3, { root: true })
        return
      case '5':
        e.preventDefault()
        dispatch('editor/selectTab', 4, { root: true })
        return
      case '6':
        e.preventDefault()
        dispatch('editor/selectTab', 5, { root: true })
        return
      case '7':
        e.preventDefault()
        dispatch('editor/selectTab', 6, { root: true })
        return
      case '8':
        e.preventDefault()
        dispatch('editor/selectTab', 7, { root: true })
        return
      case '9':
        e.preventDefault()
        dispatch('editor/selectTab', 8, { root: true })
        return
    }
  }
}

export default buildModule({ state, actions })