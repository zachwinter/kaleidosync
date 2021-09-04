import cloneDeep from 'lodash/cloneDeep'
import min from 'd3-array/src/min'
import max from 'd3-array/src/max'
import mean from 'd3-array/src/mean'
import interpolateNumber from 'd3-interpolate/src/number'
import scaleLinear from 'd3-scale/src/linear'
import { buildModule } from '@zach.winter/vue-common/util/store'
import { loadExternalScript } from '@zach.winter/common/js/dom'
import ease from '@zach.winter/common/js/ease'
import { pause } from '@zach.winter/common/js/timing'

const state = {
  intervalTypes: [
    'segments',
    'tatums',
    'beats',
    'bars',
    'sections'
  ],
  initialized: false,
  currentTrack: null,
  activeIntervals: null,
  initialPosition: null,
  trackDuration: null,
  paused: false,
  nextTracks: null,
  trackProgress: null,
  trackProgressMs: null,
  trackAnalysis: null,
  volumeQueues: {},
  volume: 1,
  songVolume: null,
  beatInterval: 'beats',
  shuffleVariants: true,
  shuffleInterval: 'bars',
  shuffleIntervalMultiplier: 2,
  connected: false,
  volumeSmoothing: 30,
  volumeReference: 20,
  volumeReferenceMultiplier: 2,
  legacy: false,
  timestamp: null,
  start: null
}

const actions = {
  async createPlayer ({ dispatch, commit, rootState }) {
    return new Promise(resolve => {
      window.onSpotifyWebPlaybackSDKReady = async () => {
        window.$player = new window.Spotify.Player({
          name: 'Kaleidosync',
          getOAuthToken: cb => { cb(rootState.spotify.accessToken) } 
        })
        await window.$player.connect()
        dispatch('attachListeners')
        commit('SET_INITIALIZED', true)
        resolve()
      }
      loadExternalScript('https://sdk.scdn.co/spotify-player.js')
    })
  },

  async legacyConnect ({ commit, dispatch, state }) {
    if (!state.legacy) commit('SET_LEGACY', true)
    const track = await dispatch('spotify/getCurrentlyPlaying', null, { root: true })
    if (track.is_playing) {
      if (!state.connected) commit('SET_CONNECTED', true)
      if (!state.initialized) commit('SET_INITIALIZED', true)
      await dispatch('fetchTrackAnalysis', track.item)
      commit('SET_CURRENT_TRACK', track.item)
      commit('SET_TIMESTAMP', track.timestamp)
      commit('SET_INITIAL_POSITION', Date.now() - track.timestamp)
      commit('SET_TRACK_DURATION', track.item.duration_ms)
      commit('SET_START', window.performance.now())
      commit('SET_PAUSED', false)
    } else {
      commit('SET_PAUSED', true)
      commit('SET_ACTIVE_INTERVALS', null)
      await pause(5000)
      await dispatch('legacyConnect')
    }
  },

  attachListeners ({ dispatch, commit, state }) {
    window.$player.addListener('player_state_changed', async (o) => {
      if (!state.connected) commit('SET_CONNECTED', true)
      const { position, duration, paused, track_window: { next_tracks, current_track }} = o
      if (!state.currentTrack || state.currentTrack.id !== current_track.id) {
        commit('SET_CURRENT_TRACK', current_track)
        commit('SET_ACTIVE_INTERVALS', null)
        await dispatch('fetchTrackAnalysis', current_track)
        dispatch('resetVolumeQueues')
      }
      commit('SET_INITIAL_POSITION', position)
      commit('SET_TRACK_DURATION', duration)
      commit('SET_PAUSED', paused)
      commit('SET_NEXT_TRACKS', next_tracks)
      if (paused) {
        commit('SET_ACTIVE_INTERVALS', null)
      }
    })
  },

  async sync ({ dispatch }) {
    if (!window.$player) return
    const _state = await window?.$player?.getCurrentState() || null
    if (!_state) return
    const { position } = _state
    window.__KALEIDOSYNC_LOOP__.volume = Math.pow(await dispatch('_getVolume', position), 3)
    await dispatch('determineActiveIntervals', position)
  },

  async legacySync ({ dispatch, state }) {
    if (!state.currentTrack) return
    window.__KALEIDOSYNC_LOOP__.trackProgressMs = Date.now() - state.timestamp
    window.__KALEIDOSYNC_LOOP__.trackProgress = Math.min(window.__KALEIDOSYNC_LOOP__.trackProgressMs / state.trackDuration, 1)
    if (window.__KALEIDOSYNC_LOOP__.trackProgress === 1) return dispatch('legacyConnect')
    window.__KALEIDOSYNC_LOOP__.volume = Math.pow(await dispatch('_getVolume', window.__KALEIDOSYNC_LOOP__.trackProgressMs), 3)
    await dispatch('determineActiveIntervals', window.__KALEIDOSYNC_LOOP__.trackProgressMs)
  },

  async fetchTrackAnalysis ({ state, dispatch, commit }, track) {
    const analysis = await dispatch('spotify/getTrackAnalysis', track.id, { root: true })
    state.intervalTypes.forEach((t) => {
      const type = analysis[t]
      type[0].duration = type[0].start + type[0].duration
      type[0].start = 0
      type[type.length - 1].duration = (track.duration_ms / 1000) - type[type.length - 1].start
      type.forEach((interval) => {
        if (interval.loudness_max_time) {
          interval.loudness_max_time = interval.loudness_max_time * 1000
        }
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
      })
    })
    const volume = analysis.segments.reduce((acc, val) => {
      acc.push(val.loudness_max)
      acc.push(val.loudness_start)
      return acc
    }, [])
    const _min = min(volume)
    const _mean = mean(volume)
    commit('SET_SONG_VOLUME', { min: _min, mean: _mean })
    commit('SET_TRACK_ANALYSIS', analysis)
  },

  determineActiveIntervals ({ state }, trackProgressMs) {
    if (!state.trackAnalysis) return 

    const determineInterval = (type) => {
      const analysis = state.trackAnalysis[type]
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) return i
        if (analysis[i].start < trackProgressMs && trackProgressMs < analysis[i + 1].start) return i
      }
    }

    const active = state.intervalTypes.reduce((acc, type) => {
      const index = determineInterval(type)
      const interval = { ...state.trackAnalysis[type][index], index }
      const { start, duration } = interval
      const elapsed = trackProgressMs - start
      interval.elapsed = elapsed
      interval.progress = elapsed / duration
      acc[type] = interval
      return acc
    }, {})
    
    window.__KALEIDOSYNC_LOOP__.activeIntervals = active
    // commit('SET_ACTIVE_INTERVALS', active)
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
    commit('SET_VOLUME_QUEUES', queues)
  },

  resetVolumeQueues ({ commit, state }) {
    const queues = cloneDeep(state.volumeQueues)
    for (let key in queues) {
      queues[key].values = []
    }
    commit('SET_VOLUME_QUEUES', queues)
  },

  async processVolumeQueues ({ state, commit, dispatch }) {
    const volume = await dispatch('getVolume')
    const queues = cloneDeep(state.volumeQueues)
    for (let key in queues) {
      queues[key].values.unshift(volume)
      while (queues[key].values.length > queues[key].totalSamples) queues[key].values.pop()
      queues[key].average = mean(queues[key].values)
      queues[key].min = min(queues[key].values)
      queues[key].max = max(queues[key].values)
      const sizeScale = scaleLinear([queues[key].min, queues[key].average], [0, 1])
      const latest = mean(queues[key].values.slice(0, queues[key].smoothing))
      queues[key].volume = sizeScale(latest)
    }
    commit('SET_VOLUME_QUEUES', queues)
  },

  getVolume ({ state }) {
    if (!state.activeIntervals) return 1

    const {
      loudness_max,
      loudness_start,
      loudness_max_time,
      duration,
      elapsed,
      start,
      index
    } = cloneDeep(state.activeIntervals.segments)

    if (!state.trackAnalysis.segments || !state.trackAnalysis.segments[index + 1]) return .5
    
    const next = state.trackAnalysis.segments?.[index + 1]?.loudness_start
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

  getSegment ({ state }, progress) {
    try {
      const analysis = state.trackAnalysis.segments
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) return i
        if (analysis[i].start < progress && progress < analysis[i + 1].start) return i
      }
    } catch {
      return -1
    }
  },

  async _getVolume ({ state, dispatch }, trackProgressMs) {
    const progress = trackProgressMs
    const base = []
    const values = []
    const index = await dispatch('getSegment', progress)
    // const reference = parseFloat(state.volumeReference)

    if (!state.trackAnalysis || !state.trackAnalysis.segments[index + 1]) return 1

    for (let i = -state.volumeSmoothing; i <= state.volumeSmoothing; i++) {
      const multiplier = parseFloat(state.volumeReferenceMultiplier)
      if (state.trackAnalysis.segments[index + (i * multiplier)]) {
        base.push(state.trackAnalysis.segments[index + (i * multiplier)].loudness_max)
        base.push(state.trackAnalysis.segments[index + (i * multiplier)].loudness_start)
      }
    }

    for (let i = -parseFloat(state.volumeSmoothing); i <= parseFloat(state.volumeSmoothing); i++) {
      const p = progress + (i * state.volumeReferenceMultiplier)
      const index = await dispatch('getSegment', p)
      const segment = state.trackAnalysis.segments[index]
      const { start, duration } = segment
      const elapsed = p - start
      segment.elapsed = elapsed
      segment.progress = elapsed / duration
      const {
        loudness_max,
        loudness_start,
        loudness_max_time,
        duration: _duration,
        elapsed: _elapsed,
        start: _start
      } = segment
      const next = state.trackAnalysis.segments?.[index + 1]?.loudness_start
      const current = start + elapsed
      if (_elapsed < loudness_max_time) {
        const progress = ease(Math.max(Math.min(1, _elapsed / loudness_max_time), 0), 'linear')
        const volume = interpolateNumber(loudness_start, loudness_max)(progress)
        values.push(volume)
      } else {
        const __start = _start + loudness_max_time
        const __elapsed = current - __start
        const __duration = _duration - loudness_max_time
        const progress = ease(Math.max(Math.min(1, __elapsed / __duration), 0), 'linear')
        const volume = interpolateNumber(loudness_max, next)(progress)
        values.push(volume)
      }
    }
    return scaleLinear([min(base) * 2, mean(base)], [0, 1])(mean(values))
  },

  toggleBeatInterval ({ commit, state }) {
    commit('SET_BEAT_INTERVAL', state.beatInterval === 'beats' ? 'tatums' : 'beats')
  },

  toggleShuffle ({ commit, state }) {
    commit('SET_SHUFFLE_VARIANTS', !state.shuffleVariants)
  }
}

export default buildModule({ state, actions })