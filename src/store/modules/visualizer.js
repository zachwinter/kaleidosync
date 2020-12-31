import { buildModule } from '@zach.winter/vue-common/util/store'
import { fetchSketches } from '@/api/sketches' 
import sample from 'lodash/sample'

const state = {
  sketches: [],
  activeSketch: null,
  activeSketchId: null,
  activeVariant: 0,
  selectingSketch: false,
  hidpi: false,
  sketch: null,
  tweenDuration: 350
}

const actions = {
  async fetchSketches ({ commit }) {
    const { sketches } = await fetchSketches()
    commit('SET_SKETCHES', sketches.reverse())
  },
  async init ({ dispatch }) {
    const { _id } = state.sketches[0]
    await dispatch('selectSketch', _id)
  },
  selectSketch ({ state, commit }, _id) {
    const { shader, uniforms } = state.sketches.find(({ _id: id }) => _id === id)
    commit('SET_SELECTING_SKETCH', true)
    commit('SET_ACTIVE_VARIANT', 0)
    commit('SET_ACTIVE_SKETCH', { shader, uniforms, _id })
    commit('SET_ACTIVE_SKETCH_ID', _id)
    commit('SET_SELECTING_SKETCH', false)
  },
  async selectRandomSketch ({ state, dispatch }) {
    const { _id } = sample(state.sketches)
    await dispatch('selectSketch', _id)
  },
  setVariant ({ commit, /*dispatch*/ }, { i, duration = 350 }) {
    commit('SET_TWEEN_DURATION', duration)
    commit('SET_ACTIVE_VARIANT', i)
  },
  updateUniforms ({ commit }, uniforms) {
    commit('SET_UNIFORMS', uniforms)
  },
  async selectByIndex ({ state, dispatch }, i) {
    await dispatch('selectSketch', state.sketches[i]._id)
  }
}

export default buildModule({ state, actions })