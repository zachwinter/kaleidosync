import { get } from '../util/network'
import {
  SET_HOVER,
  SET_TOAST_VISIBLE,
  SET_HIDE_ALL,
  SET_HOVER_TIMEOUT,
  SET_TOAST_MESSAGE,
  TRAILS_SET_SIDES,
  TRAILS_SET_GLOW_WIDTH,
  TRAILS_SET_TRAIL_LENGTH,
  TRAILS_SET_WIDTH_CONSTANT,
  TRAILS_SET_ROTATION_CONSTANT,
  TRAILS_SET_SMEAR,
  TRAILS_SET_ROTATION_MULTIPLIER
} from './mutation-types'
import { randomNumber } from '../util/numbers'
import { TRAILS } from '../enums'

export default {
  async login () {
    // eslint-disable-next-line 
    const LOCAL_ROOT = (PRODUCTION) ? '' : '/api' 
    const { data } = await get(LOCAL_ROOT + '/auth')
    if (data.auth_id) {
      window.location.href = `${LOCAL_ROOT}/login?auth_id=${data.auth_id}`
    }
  },

  hover ({ commit }) {
    commit(SET_HOVER, true)
    commit(SET_HOVER_TIMEOUT, state => {
      if (state.settingsVisible === false) {
        commit(SET_HOVER, false)
      }
    }) 
  },

  toast ({ commit }, { message, autoHide = true }) {
    commit(SET_TOAST_VISIBLE, false)
    commit(SET_TOAST_MESSAGE, { message, autoHide })
    commit(SET_TOAST_VISIBLE, true)
  },
  
  hideAll ({ commit }) {
    commit(SET_HIDE_ALL, true)
  },

  randomize ({ commit }) {
    commit(TRAILS_SET_SIDES, randomNumber(TRAILS.settings.SIDES.MIN, TRAILS.settings.SIDES.MAX, true))
    commit(TRAILS_SET_TRAIL_LENGTH, randomNumber(TRAILS.settings.TRAIL_LENGTH.MIN, TRAILS.settings.TRAIL_LENGTH.MAX, true))
    commit(TRAILS_SET_ROTATION_CONSTANT, randomNumber(TRAILS.settings.ROTATION_CONSTANT.MIN, TRAILS.settings.ROTATION_CONSTANT.MAX))
    commit(TRAILS_SET_WIDTH_CONSTANT, randomNumber(TRAILS.settings.WIDTH_CONSTANT.MIN, TRAILS.settings.WIDTH_CONSTANT.MAX))
    commit(TRAILS_SET_GLOW_WIDTH, randomNumber(TRAILS.settings.GLOW_WIDTH.MIN, TRAILS.settings.GLOW_WIDTH.MAX))
    commit(TRAILS_SET_SMEAR, randomNumber(TRAILS.settings.SMEAR.MIN, TRAILS.settings.SMEAR.MAX))
  },

  reset ({ commit }) {
    commit(TRAILS_SET_SIDES, TRAILS.settings.SIDES.INITIAL)
    commit(TRAILS_SET_TRAIL_LENGTH, TRAILS.settings.TRAIL_LENGTH.INITIAL)
    commit(TRAILS_SET_ROTATION_CONSTANT, TRAILS.settings.ROTATION_CONSTANT.INITIAL)
    commit(TRAILS_SET_WIDTH_CONSTANT, TRAILS.settings.WIDTH_CONSTANT.INITIAL)
    commit(TRAILS_SET_GLOW_WIDTH, TRAILS.settings.GLOW_WIDTH.INITIAL)
    commit(TRAILS_SET_SMEAR, TRAILS.settings.SMEAR.INITIAL)
    commit(TRAILS_SET_ROTATION_MULTIPLIER, TRAILS.settings.ROTATION_MULTIPLIER.INITIAL)
  }
}