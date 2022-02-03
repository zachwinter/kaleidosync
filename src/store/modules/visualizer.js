import { buildModule } from '@zach.winter/vue-common/util/store'
import { fetchSketches } from '@/api/sketches' 
import sample from 'lodash/sample'
import cloneDeep from 'lodash/cloneDeep'
import { pause } from '@zach.winter/common/js/timing'
import { setting, types } from '@/util/settings'

const hidpi = setting('hidpi', false, types.boolean);
const activeSketchId = setting('activeSketchId', null, types.string);

const state = {
  sketches: [],
  activeSketch: null,
  get activeSketchId() { return activeSketchId.get() },
  set activeSketchId(value) { return activeSketchId.set(value) },
  activeVariant: 0,
  selectingSketch: false,
  get hidpi() { return hidpi.get() },
  set hidpi(value) { return hidpi.set(value) },
  sketch: null,
  devSketch: null,
  tweenDuration: 350,
  devMode: false
}

const actions = {
  async fetchSketches ({ commit }) {
    const { sketches } = await fetchSketches()
    commit('SET_SKETCHES', sketches.reverse())
  },
  async init ({ state, dispatch }) {
    // resore selected sketch
    if (state.activeSketchId && state.sketches.some(_ => _._id === state.activeSketchId)) {
      await dispatch('selectSketch', state.activeSketchId)
    }
    else {
      const { _id } = state.sketches[0]
      await dispatch('selectSketch', _id)
    }
  },
  async selectSketch ({ state, commit }, _id) {
    const { shader, uniforms } = state.sketches.find(({ _id: id }) => _id === id)
    commit('SET_SELECTING_SKETCH', true)
    commit('SET_ACTIVE_VARIANT', 0)
    commit('SET_ACTIVE_SKETCH', { shader, uniforms, _id })
    commit('SET_ACTIVE_SKETCH_ID', _id)
    await pause(0) // Fuck you.
    commit('SET_ACTIVE_SKETCH', { shader, uniforms, _id })
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
  },
  enableDevMode ({ state, commit }) {
    commit('SET_DEV_SKETCH', cloneDeep(state.sketch))
    commit('player/SET_SHUFFLE_VARIANTS', false, { root: true })
  },
  onCodeInput ({ state, commit }) {
    commit('SET_DEV_SKETCH', cloneDeep(state.devSketch))
  }
}

export default buildModule({ state, actions })