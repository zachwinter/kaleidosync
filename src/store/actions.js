import { get } from '@/util/network'
import * as cookies from '../util/cookie'
import cloneDeep from 'lodash/cloneDeep'
import { pause } from '../util/timing'
import { min, max } from 'd3-array'
import { average } from '@/util/array'
import interpolateNumber from 'd3-interpolate/src/number'
import scaleLinear from 'd3-scale/src/linear'
import ease from '@/util/ease'
import {
  SET_AUTH_ID,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
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
  SET_VOLUME_QUEUES,
  SET_ACTIVE_INTERVAL,
  SET_TRAILS,
  SET_HOVER,
  SET_HOVER_TIMEOUT,
  SET_BEAT_INTERVAL,
  SET_TOAST_VISIBLE,
  SET_TOAST_MESSAGE
} from './mutation-types'

// eslint-disable-next-line 
const LOCAL_ROOT = (PRODUCTION) ? '' : '/api' 

export default {
  async login ({ commit }) {
    try {
      const { data } = await get(LOCAL_ROOT + '/auth')
      if (data.auth_id) {
        commit(SET_AUTH_ID, data.auth_id)
        window.location.href = `${LOCAL_ROOT}/login?auth_id=${data.auth_id}`
      }
    } catch (e) {
      // eslint-disable-next-line 
      console.log(e)
    }
  },

  readTokens ({ commit }) {
    // eslint-disable-next-line 
    const accessToken = cookies.get(ACCESS_TOKEN)
    // eslint-disable-next-line 
    const refreshToken = cookies.get(REFRESH_TOKEN)
    // eslint-disable-next-line 
    const refreshCode = cookies.get(REFRESH_CODE)

    commit(SET_ACCESS_TOKEN, accessToken)
    commit(SET_REFRESH_TOKEN, refreshToken)
    commit(SET_REFRESH_TOKEN, refreshCode)
  },

  async refreshTokens ({ state, commit, dispatch }) {
    try {
      // eslint-disable-next-line 
      const { data } = await get(`${LOCAL_ROOT}/refresh?token=${state.api.refreshToken}`)
      // eslint-disable-next-line 
      cookies.set(SPOTIFY_ACCESS_TOKEN, data.access_token)
      commit(SET_ACCESS_TOKEN, data.access_token)
      dispatch('ping')
    } catch (e) {
      dispatch('login')
    }
  },

  async getCurrentlyPlaying ({ state, commit, dispatch }) {
    try {
      var { data } = await get('https://api.spotify.com/v1/me/player', { headers: state.api.headers })
    } catch (e) {
      if (e.status === 401) return dispatch('refreshTokens')
      if (e.status === 429) await pause(5000)
      return dispatch('ping')
    }
    
    if (!data || !data.is_playing || !data.item) {
      if (state.active) commit(SET_ACTIVE, false)
      commit(SET_NO_PLAYBACK, true)
      commit(SET_ACTIVE, false)
      dispatch('toast', {
        message: 'No playback detected',
        autoHide: false
      })  
      return dispatch('ping')
    } else {
      commit(SET_TOAST_VISIBLE, false)
    }

    const songsInSync = JSON.stringify(data.item) === JSON.stringify(state.currentlyPlaying)

    if (!state.initialized || !songsInSync || !state.active) {
      return dispatch('getTrackInfo', data)
    }
    
    dispatch('ping')
  },

  async getTrackInfo ({ state, commit, dispatch }, currentlyPlaying) {
    commit(SET_LOADING_NEXT_SONG, true)

    try {
      var [ analysis, features ] = await Promise.all([
        get(`https://api.spotify.com/v1/audio-analysis/${currentlyPlaying.item.id}`, { headers: state.api.headers }).then(res => res.data),
        get(`https://api.spotify.com/v1/audio-features/${currentlyPlaying.item.id}`, { headers: state.api.headers }).then(res => res.data),
      ])
    } catch (e) {
      return dispatch('ping')
    }

    commit(SET_CURRENTLY_PLAYING, currentlyPlaying.item)

    state.intervalTypes.forEach((t) => {
      const type = analysis[t]
      type[0].duration = type[0].start + type[0].duration
      type[0].start = 0
      type[type.length - 1].duration = (state.currentlyPlaying.duration_ms / 1000) - type[type.length - 1].start
      type.forEach((interval) => {
        if (interval.loudness_max_time) {
          interval.loudness_max_time = interval.loudness_max_time * 1000
        }
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
      })
    })

    commit(SET_TRACK_FEATURES, features)
    commit(SET_TRACK_ANALYSIS, analysis)
    commit(SET_LOADING_NEXT_SONG, false)
    commit(SET_INITIAL_TRACK_PROGRESS, Date.now() - currentlyPlaying.timestamp)
    commit(SET_TRACK_PROGRESS, Date.now() - currentlyPlaying.timestamp)
    commit(SET_INITIAL_START, window.performance.now())
    
    dispatch('determineBeatInterval')

    if (!state.initialized) commit(SET_INITIALIZED, true)
    if (!state.active) commit(SET_ACTIVE, true)
    if (!state.noPlayback) commit(SET_NO_PLAYBACK, false)

    dispatch('ping')
  },

  async ping ({ dispatch }) {
    await pause(5000)
    dispatch('getCurrentlyPlaying')
  },

  async tickUpdate ({ commit, dispatch, state }) {
    commit(SET_TRACK_PROGRESS, (window.performance.now() - state.initialStart) + state.initialTrackProgress)
    await dispatch('setActiveIntervals')
    await dispatch('processVolumeQueues')
  },

  setActiveIntervals ({ commit, state }) {
    const determineInterval = (type) => {
      const analysis = state.trackAnalysis[type]
      const progress = state.trackProgress
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) return i
        if (analysis[i].start < progress && progress < analysis[i + 1].start) return i
      }
    }
  
    state.intervalTypes.forEach(type => {
      const index = determineInterval(type)
      const interval = { ...state.trackAnalysis[type][index], index }
      const { start, duration } = interval
      const elapsed = state.trackProgress - start
      interval.elapsed = elapsed
      interval.progress = elapsed / duration
      commit(SET_ACTIVE_INTERVAL, { type, interval })
    })
  },

  registerVolumeQueue ({ commit, state }, { name, totalSamples, smoothing }) {
    const queues = cloneDeep(state.volumeQueues)
    queues[name] = {
      values: [],
      volume: .5,
      average: .5,
      min: 0,
      max: 1,
      totalSamples,
      smoothing
    }
    commit(SET_VOLUME_QUEUES, queues)
  },

  determineBeatInterval ({ state, commit }) {
    const average = state.trackAnalysis.tatums.reduce((total, tatum) => total + tatum.duration, 0) / state.trackAnalysis.tatums.length
    const interval = average >= 300 ? 'tatums' : 'beats'
    commit(SET_BEAT_INTERVAL, interval)
  },

  async processVolumeQueues ({ state, commit, dispatch }) {
    const volume = await dispatch('getVolume')
    const queues = {...state.volumeQueues}
    for (let key in state.volumeQueues) {
      state.volumeQueues[key].values.unshift(volume)
      while (state.volumeQueues[key].values.length > state.volumeQueues[key].totalSamples) state.volumeQueues[key].values.pop()
      state.volumeQueues[key].average = average(state.volumeQueues[key].values)
      state.volumeQueues[key].min = min(state.volumeQueues[key].values)
      state.volumeQueues[key].max = max(state.volumeQueues[key].values)
      const sizeScale = scaleLinear([state.volumeQueues[key].min, queues[key].average], [0, 1])
      const latest = average(state.volumeQueues[key].values.slice(0, state.volumeQueues[key].smoothing))
      state.volumeQueues[key].volume = sizeScale(latest)
    }
    
    commit(SET_VOLUME_QUEUES, queues)
  },

  getVolume ({ state }) {
    const {
      loudness_max,
      loudness_start,
      loudness_max_time,
      duration,
      elapsed,
      start,
      index
    } = state.activeIntervals.segments

    if (!state.trackAnalysis.segments[index + 1]) return 0
    
    const next = state.trackAnalysis.segments[index + 1].loudness_start
    const current = start + elapsed
    const easing = 'linear' 
  
    if (elapsed < loudness_max_time) {
      const progress = ease(Math.max(Math.min(1, elapsed / loudness_max_time), 0), easing)
      return interpolateNumber(loudness_start, loudness_max)(progress)
    } else {
      const _start = start + loudness_max_time
      const _elapsed = current - _start
      const _duration = duration - loudness_max_time
      const progress = ease(Math.max(Math.min(1, _elapsed / _duration), 0), easing)
      return interpolateNumber(loudness_max, next)(progress)
    }
  },

  addTrailsRing ({ state, commit }) {
    const trail = {...state.trails[state.trails.length -1]}
    trail.radius = trail.radius * .5
    commit(SET_TRAILS, [...state.trails, trail])
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
  }
}