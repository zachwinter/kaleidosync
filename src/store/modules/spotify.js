import { get } from '@/util/network'
import * as cookies from '@/util/cookie'
import cloneDeep from 'lodash/cloneDeep'
import { pause } from '@/util/timing'
import { min, max } from 'd3-array'
import { average } from '@/util/array'
import interpolateNumber from 'd3-interpolate/src/number'
import scaleLinear from 'd3-scale/src/linear'
import ease from '@/util/ease'
import { SET_TOAST_MESSAGE, SET_TOAST_VISIBLE } from './ui'

export const SET_AUTH_ID = 'SET_AUTH_ID'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN'
export const SET_REFRESH_CODE = 'SET_REFRESH_CODE'
export const SET_CURRENTLY_PLAYING = 'SET_CURRENTLY_PLAYING'
export const SET_TRACK_ANALYSIS = 'SET_TRACK_ANALYSIS'
export const SET_TRACK_FEATURES = 'SET_TRACK_FEATURES'
export const SET_INITIAL_TRACK_PROGRESS = 'SET_INITIAL_TRACK_PROGRESS'
export const SET_TRACK_PROGRESS = 'SET_TRACK_PROGRESS'
export const SET_INITIAL_START = 'SET_INITIAL_START'
export const SET_ACTIVE = 'SET_ACTIVE'
export const SET_NO_PLAYBACK = 'SET_NO_PLAYBACK'
export const SET_INITIALIZED = 'SET_INITIALIZED'
export const SET_LOADING_NEXT_SONG = 'SET_LOADING_NEXT_SONG'
export const SET_VOLUME_QUEUES = 'SET_VOLUME_QUEUES'
export const SET_ACTIVE_INTERVAL = 'SET_ACTIVE_INTERVAL'
export const SET_BEAT_INTERVAL = 'SET_BEAT_INTERVAL'
export const SET_RETRYING = 'SET_RETRYING'
export const SET_STATUS = 'SET_STATUS'

export const FETCHING = 'FETCHING'
export const ERROR = 'ERROR'
export const SUCCESS = 'SUCCESS'

// eslint-disable-next-line 
const LOCAL_ROOT = (PRODUCTION) ? '' : '/api' 
const PING_DELAY = 60000

export default {
  namespaced: true,
  state: {
    api: {
      authID: null,
      accessToken: null,
      refreshToken: null,
      refreshCode: null,
      headers: null
    },
    intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
    activeIntervals: {
      tatums: {},
      segments: {},
      beats: {},
      bars: {},
      sections: {},
    },
    currentlyPlaying: {},
    trackAnalysis: {},
    trackFeatures: {},
    initialTrackProgress: 0,
    volumeQueues: {},
    initialStart: 0,
    trackProgress: 0,
    active: false,
    initialized: false,
    noPlayback: false,
    loadingNextSong: false,
    retrying: false,
    beatInterval: 'tatums',
    status: {
      currentlyPlaying: null,
      trackAnalysis: null
    }
  },

  mutations: {
    [SET_AUTH_ID] (state, val) {
      state.api.authID = val
    },
    [SET_ACCESS_TOKEN] (state, val) {
      state.api.accessToken = val
      state.api.headers = {
        'Authorization': 'Bearer ' + val,
        'Accept': 'application/json'
      }
    },
    [SET_REFRESH_TOKEN] (state, val) {
      state.api.refreshToken = val
    },
    [SET_REFRESH_CODE] (state, val) {
      state.api.refreshCode = val
    },
    [SET_CURRENTLY_PLAYING] (state, val) {
      state.currentlyPlaying = val
    },
    [SET_TRACK_ANALYSIS] (state, val) {
      state.trackAnalysis = val
    },
    [SET_TRACK_FEATURES] (state, val) {
      state.trackFeatures = val
    },
    [SET_INITIAL_TRACK_PROGRESS] (state, val) {
      state.initialTrackProgress = val
    },
    [SET_TRACK_PROGRESS] (state, val) {
      state.trackProgress = val
    },
    [SET_INITIAL_START] (state, val) {
      state.initialStart = val
    },
    [SET_ACTIVE] (state, val) {
      state.active = val
    },
    [SET_LOADING_NEXT_SONG] (state, val) {
      state.loadingNextSong = val
    },
    [SET_BEAT_INTERVAL] (state, val) {
      state.beatInterval = val
    },
    [SET_VOLUME_QUEUES] (state, val) {
      state.volumeQueues = val
    },
    [SET_INITIALIZED] (state, val) {
      state.initialized = val
    },
    [SET_NO_PLAYBACK] (state, val) {
      state.noPlayback = val
    },
    [SET_ACTIVE_INTERVAL] (state, { type, interval }) {
      state.activeIntervals[type] = interval
    },
    [SET_RETRYING] (state, val) {
      state.retrying = val
    },
    [SET_STATUS] (state, { key, value }) {
      state.status[key] = value
    }
  },

  actions: {
    async login ({ commit }) {
      try {
        const { data } = await get(LOCAL_ROOT + '/auth')
        if (data.auth_id) {
          commit(SET_AUTH_ID, data.auth_id)
          window.location.href = `${LOCAL_ROOT}/login?auth_id=${data.auth_id}`
        }
      } catch (e) {
        window.location.href = '/'
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
        dispatch('getCurrentlyPlaying')
      } catch (e) {
        window.location.href = '/'
        // eslint-disable-next-line 
        console.log(e)
      }
    },
  
    async getCurrentlyPlaying ({ state, commit, dispatch }) {
      commit(SET_STATUS, { key: 'currentlyPlaying', value: FETCHING })
      try {
        var { data } = await get('https://api.spotify.com/v1/me/player/currently-playing', { headers: state.api.headers })
        commit(SET_STATUS, { key: 'currentlyPlaying', value: SUCCESS })
      } catch (e) {
        commit(SET_STATUS, { key: 'currentlyPlaying', value: ERROR })
        if (e.status === 401) return dispatch('refreshTokens')
        if (e.status === 429) return dispatch('retryAfter', { retry: e.retry, action: 'getCurrentlyPlaying' })
      }
      
      if (!data || !data.is_playing || !data.item) {
        if (state.active) commit(SET_ACTIVE, false)
        commit(SET_NO_PLAYBACK, true)
        commit(SET_ACTIVE, false)
        dispatch('ui/toast', {
          message: 'No playback detected',
          subText: 'Play a song, then click the refresh icon.',
          autoHide: false
        }, { root: true })  
      } 
  
      const songsInSync = JSON.stringify(data.item) === JSON.stringify(state.currentlyPlaying)
  
      if (!state.initialized || !songsInSync || !state.active) {
        return dispatch('getTrackInfo', data)
      }
    },
  
    async getTrackInfo ({ state, commit, dispatch }, currentlyPlaying) {
      commit(SET_STATUS, { key: 'trackAnalysis', value: FETCHING })
  
      try {
        var [ analysis /*, features */ ] = await Promise.all([
          get(`https://api.spotify.com/v1/audio-analysis/${currentlyPlaying.item.id}`, { headers: state.api.headers }).then(res => res.data),
          // get(`https://api.spotify.com/v1/audio-features/${currentlyPlaying.item.id}`, { headers: state.api.headers }).then(res => res.data),
        ])
        commit(SET_STATUS, { key: 'trackAnalysis', value: SUCCESS })
      } catch (e) {
        commit(SET_STATUS, { key: 'trackAnalysis', value: ERROR })
        if (e.status === 401) return dispatch('refreshTokens')
        if (e.status === 429) return dispatch('retryAfter', { retry: e.retry, action: 'getTrackInfo', param: currentlyPlaying })
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
  
      // commit(SET_TRACK_FEATURES, features)
      commit(SET_TRACK_ANALYSIS, analysis)
      commit(SET_LOADING_NEXT_SONG, false)
      commit(SET_INITIAL_TRACK_PROGRESS, Date.now() - currentlyPlaying.timestamp)
      commit(SET_TRACK_PROGRESS, Date.now() - currentlyPlaying.timestamp)
      commit(SET_INITIAL_START, window.performance.now())
      commit(SET_RETRYING, false)
      
      dispatch('determineBeatInterval')
  
      if (!state.initialized) commit(SET_INITIALIZED, true)
      if (!state.active) commit(SET_ACTIVE, true)
      if (!state.noPlayback) commit(SET_NO_PLAYBACK, false)
    },

    async retryAfter ({ commit, dispatch, rootState, state }, { retry, action, param = null }) {
      if (state.retrying) return
      commit(SET_RETRYING, true)
      dispatch('ui/toast', {
        message: `Spotify is busy! Retrying in ${retry} seconds.`,
        subText: `Please don't refresh your browser.`,
        autoHide: false
      }, { root: true })
      let remaining = parseInt(retry, 10) + 1
      const interval = setInterval(() => {
        commit(`ui/${SET_TOAST_MESSAGE}`, {
          ...rootState.ui.toast,
          message: `Spotify is busy! Retrying in ${remaining} second${remaining === 1 ? '' : 's'}.`,
        }, { root: true })
        remaining--
        if (remaining === 0) clearInterval(interval)
      }, 1000)
      await pause((retry * 1000) + 1000)
      commit(`ui/${SET_TOAST_VISIBLE}`, false, { root: true })
      dispatch(action, param)
      commit(SET_RETRYING, false)
    },
  
    async ping ({ dispatch }) {
      await pause(PING_DELAY)
      dispatch('getCurrentlyPlaying')
    },
  
    async tickUpdate ({ commit, dispatch, state }) {
      commit(SET_TRACK_PROGRESS, (window.performance.now() - state.initialStart) + state.initialTrackProgress)
      await dispatch('setActiveIntervals')
      await dispatch('processVolumeQueues')
      if (state.currentlyPlaying.duration_ms <= state.trackProgress && state.active) {
        commit(SET_ACTIVE, false)
        await pause(500)
        dispatch('getCurrentlyPlaying')
      }
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
  
    determineBeatInterval ({ commit, state }) {
      const average = state.trackAnalysis.tatums.reduce((total, tatum) => total + tatum.duration, 0) / state.trackAnalysis.tatums.length
      const interval = average >= 200 ? 'tatum' : 'beat'
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
  
      if (!state.trackAnalysis.segments || !state.trackAnalysis.segments[index + 1]) return .5
      
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
    }
  }
}