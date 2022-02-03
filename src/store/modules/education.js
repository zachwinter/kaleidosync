import * as cookies from '@zach.winter/common/js/cookies'
import { buildModule } from '@zach.winter/vue-common/util/store'

const state = {
  educated: JSON.parse(cookies.get('educated')) || false
}

const actions = {
  dismis({ commit }) {
    cookies.set('educated', JSON.stringify(true))
    commit('SET_EDUCATED', true)
  }
}

export default buildModule({ state, actions })