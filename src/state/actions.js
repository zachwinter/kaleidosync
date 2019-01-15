import * as Cookie from '../util/cookie'
import {
  setCurrentlyPlaying, 
  startVisualizer, 
  stopVisualizer, 
  setTrackProgress,
  normalizeIntervals,
  setTokens
} from './mutations'

/**
 * @function ping – Ping Spotify for currently playing track after specified delay.
 * @param state – Application state. 
 */
export function ping (state) {
  setTimeout(() => getCurrentlyPlaying(state), state.api.pingDelay)
}

/**
 * @function getCurrentlyPlaying – Ping Spotify for currently playing track.
 * @param state – Application state. 
 */
export function getCurrentlyPlaying (state) {
  const request = new Request(state.api.currentlyPlaying, { headers: state.api.headers })

  fetch(request)
    .then(res => res.json())
    .then(res => {
      /** If 401, get new API token. */
      if (res.error && res.error.status === 401) {
        return getNewToken(state)
      }

      /** Otherwise, process API response. */
      processResponse(state, {
        track: res.item,
        playing: res.is_playing,
        timestamp: res.timestamp,
        progress: res.progress_ms
      })
    })
    .catch(err => console.log(err))
}

/**
 * @function getNewToken – Get new API token from back end.
 * @param state – Application state. 
 */
export function getNewToken (state) {
  if (!state.tokens.refreshToken) {
    return window.location.href = ''
  }

  fetch('http://localhost:8001/refresh?token=' + state.tokens.refreshToken)
    .then(res => res.json())
    .then(res => {
      Cookie.set('KALEIDOSYNC_ACCESS_TOKEN', res.access_token)
      setTokens(state)
      ping(state)
    })
    .catch(err => console.log(err))
}

/**
 * @function getTrackData – Ping Spotify for track analysis and track features for currently playing track.
 * @param state – Application state. 
 * @param track – Currently playing track.
 * @param progress – `progress_ms` from Spotify response.
 */
export function getTrackData (state, { track, progress }) {
  const { trackAnalysis, trackFeatures, headers } = state.api
  
  const analysis = fetch(new Request(trackAnalysis + track.id, { headers })).then(res => res.json())
  const features = fetch(new Request(trackFeatures + track.id, { headers })).then(res => res.json()) 
  
  /** We need to keep track of how long these requests take so we can add latency to current track progress. */
  const now = window.performance.now()

  Promise.all([ analysis, features ]).then(responses => {
    const analysis = {...responses[0]}
    const features = {...responses[1]}
    
    /** If 401, get new API token. */
    if (analysis.error && analysis.error.status === 401) { return getNewToken(state) }
    if (features.error && features.error.status === 401) { return getNewToken(state) }

    normalizeIntervals(state, {
      track,
      analysis
    })

    setCurrentlyPlaying(state, {
      track,
      analysis,
      features,
      progress: progress + (window.performance.now() - now) 
    })

    ping(state)
  }).catch(err => console.log(err))
}

/**
 * @function processResponse – Process response from Spotiry API.
 * @param state – Application state. 
 * @param track – Currently playing track.
 * @param playing – `is_playing` from Spotify response.
 * @param progress – `progress_ms` from Spotify response.
 */
export function processResponse (state, { track, playing, progress }) {
  const songsInSync = JSON.stringify(state.visualizer.currentlyPlaying) === JSON.stringify(track)

  const stats = {
    client: state.visualizer.trackProgress,
    server: progress,
    error: state.visualizer.trackProgress - progress
  }
  
  console.log(`Sync error: ${Math.round(stats.error)}ms`)

  if (track === null || track === undefined) {
    return ping(state)
  }

  if (playing && !state.visualizer.active) {
    if (songsInSync) {
      startVisualizer(state)
      return ping(state)
    }
    
    return getTrackData(state, { track, progress })
  }

  if (!playing && state.visualizer.active) {
    stopVisualizer(state)
  }

  if (playing && state.visualizer.active && !songsInSync) {
    return getTrackData(state, { track, progress })
  }

  if (playing && state.visualizer.active && songsInSync && Math.abs(stats.error) > 500) {
    setTrackProgress(state, { progress })
  }

  ping(state)
}