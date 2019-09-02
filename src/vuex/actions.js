import { get } from '../util/network'
import {
  SET_HOVER,
  SET_TOAST_VISIBLE,
  SET_HIDE_ALL,
  SET_HOVER_TIMEOUT,
  SET_TOAST_MESSAGE
} from './mutation-types'

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
  }
}