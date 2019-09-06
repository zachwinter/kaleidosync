import Observe from '../util/observe'
import * as cookies from '../util/cookie'
import { get } from '../util/network'
import { interpolateNumber } from 'd3-interpolate'
import { scaleLog, scaleLinear, scalePow } from 'd3-scale'
import { min, max } from 'd3-array'
import { average } from '../util/array'
import { pause } from '../util/timing'

/**
 * @class Sync
 * 
 * Creates an interface for analyzing a playing Spotify track in real time.
 * Exposes event hooks for reacting to changes in intervals. 
 */
export default class Sync {
  constructor ({
    volumeSmoothing = 100,
    volumeAverage = 200,
    pingDelay = 2500,
    fixed = false,
    staticIntervalBaseDuration = 2000,
    $store = null
  } = {}) {
    // eslint-disable-next-line 
    const accessToken = cookies.get(ACCESS_TOKEN)
    // eslint-disable-next-line 
    const refreshToken = cookies.get(REFRESH_TOKEN)
    // eslint-disable-next-line 
    const refreshCode = cookies.get(REFRESH_CODE)

    if ($store) {
      this.$store = $store
    }

    this.fixed = fixed

    this.state = Observe({
      api: {
        currentlyPlaying: 'https://api.spotify.com/v1/me/player',
        trackAnalysis: 'https://api.spotify.com/v1/audio-analysis/',
        trackFeatures: 'https://api.spotify.com/v1/audio-features/',
        tokens: {
          accessToken,
          refreshToken,
          refreshCode
        },
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        },
        pingDelay
      },
      intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
      activeIntervals: Observe({
        tatums: {},
        segments: {},
        beats: {},
        bars: {},
        sections: {}
      }),
      currentlyPlaying: {},
      trackAnalysis: {},
      trackFeatures: {},
      initialTrackProgress: 0,
      initialStart: 0,
      trackProgress: 0,
      active: false,
      initialized: false,
      noPlayback: false,
      loadingNextSong: false,
      volumeSmoothing,
      volumeAverage,
      volume: 0,
      queues: {
        volume: [],
        beat: []
      },
      volumeQueues: {

      }
    })

    this.initHooks()

    if (fixed === true) {
      this.state.trackAnalysis = this.buildStaticIntervals(staticIntervalBaseDuration)
      this.state.trackFeatures = {
        "danceability" : 0.5,
        "energy" : 0.5,
        "key" : 9,
        "loudness" : -10,
        "mode" : 1,
        "speechiness" : 0.1,
        "acousticness" : 0.1,
        "instrumentalness" : 0.5,
        "liveness" : 0.1,
        "valence" : 0.5,
        "tempo" : 100.030
      }
      this.state.active = true
      requestAnimationFrame(this.tick.bind(this))
    } else {
      this.ping()
    }
  }

  /**
   * @method initHooks - Initialize interval event hooks. 
   */
  initHooks () {
    this.hooks = {
      tatum: [],
      segment: [],
      beat: [],
      bar: [],
      section: []
    }

    this.state.activeIntervals.watch('tatums', t => {
      this.hooks.tatum.forEach(h => h(t))
    })

    this.state.activeIntervals.watch('segments', s => { 
      this.hooks.segment.forEach(h => h(s))
    })

    this.state.activeIntervals.watch('beats', b => { 
      this.hooks.beat.forEach(h => h(b))
    })

    this.state.activeIntervals.watch('bars', b => {
      this.hooks.bar.forEach(h => h(b))
    })

    this.state.activeIntervals.watch('sections', s => {
      this.hooks.section.forEach(h => h(s))
    })
  }

  /**
   * @method ping - Ask Spotify for currently playing track, after a specified delay. 
   */
  ping () {
    setTimeout(() => this.getCurrentlyPlaying(), this.state.api.pingDelay)
  }

  /**
   * @method getNewToken - Retrieve new access token from server. 
   */
  async getNewToken () {
    try {
      // eslint-disable-next-line 
      const { data } = await get(`${PROJECT_ROOT}/refresh?token=${this.state.api.tokens.refreshToken}`)
      // eslint-disable-next-line 
      cookies.set(SPOTIFY_ACCESS_TOKEN, data.access_token)
      this.state.api.tokens.accessToken = data.access_token
      this.state.api.headers = {
        'Authorization': 'Bearer ' + this.state.api.tokens.accessToken,
        'Accept': 'application/json'
      }
      this.ping()
    } catch (e) {
      if (this.$store) {
        this.$store.dispatch('toast', {
          message: 'Session expired. Logging back in...'
        })

        await pause(2000)
      }

      auth()
    }
  }

  /**
   * @method getCurrentlyPlaying - Ask Spotify for currently playing track.
   */
  async getCurrentlyPlaying () {
    try {
      const { data } = await get(this.state.api.currentlyPlaying, { headers: this.state.api.headers })
      
      if (!data || !data.is_playing) {
        if (this.state.active === true) {
          this.state.active = false
        }

        if (this.state.noPlayback === false) {
          this.state.noPlayback = true
        }
        return this.ping()
      }

      this.processResponse(data)
    } catch ({ status }) {
      if (status === 401) {
        return this.getNewToken()
      }

      if (this.$store) {
        this.$store.dispatch('toast', {
          message: 'Oops! Spotify error. Refreshing now.'
        })

        await pause(2000)
      }

      auth(this.$store)
    }
  }

  /**
   * @method processResponse - Process `currently playing` API response according to state.
   * @param {object} data - Response from Spotify API. 
   */
  processResponse (data) {
    const songsInSync = (JSON.stringify(data.item) === JSON.stringify(this.state.currentlyPlaying))

    if (this.state.initialized === false || !songsInSync || this.state.active === false) {
      return this.getTrackInfo(data)
    }

    this.ping()
  }
  
  /**
   * @method getTrackInfo - Fetch track analysis and track features of currently playing track.
   * @param {object} data - Response from Spotify API. 
   */
  async getTrackInfo (data) {
    this.state.loadingNextSong = true

    const [ analysis, features ] = await Promise.all([
      get(this.state.api.trackAnalysis + data.item.id, { headers: this.state.api.headers }).then(res => res.data),
      get(this.state.api.trackFeatures + data.item.id, { headers: this.state.api.headers }).then(res => res.data),
    ])

    this.state.intervalTypes.forEach((t) => {
      const type = analysis[t]
      type[0].duration = type[0].start + type[0].duration
      type[0].start = 0
      type[type.length - 1].duration = (data.item.duration_ms / 1000) - type[type.length - 1].start
      type.forEach((interval) => {
        if (interval.loudness_max_time) {
          interval.loudness_max_time = interval.loudness_max_time * 1000
        }
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
      })
    })

    this.state.currentlyPlaying = data.item
    this.state.trackAnalysis = analysis
    this.state.trackFeatures = features
    this.state.initialTrackProgress = Date.now() - data.timestamp
    this.state.trackProgress = Date.now() - data.timestamp
    this.state.initialStart = window.performance.now()
    this.state.loadingNextSong = false
    this.resetVolumeQueues()
    
    if (this.state.initialized === false) {
      requestAnimationFrame(this.tick.bind(this))
      this.state.initialized = true
    }

    if (this.state.active === false) {
      this.state.active = true
    }

    if (this.state.noPlayback === true) {
      this.state.noPlayback = false
    }

    this.ping()
  }

  /**
   * @method setActiveIntervals - Use current track progress to determine active intervals of each type.
   */
  setActiveIntervals () {
    const determineInterval = (type) => {
      const analysis = this.state.trackAnalysis[type]
      const progress = this.state.trackProgress
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) return i
        if (analysis[i].start < progress && progress < analysis[i + 1].start) return i
      }
    }
  
    this.state.intervalTypes.forEach(type => {
      const index = determineInterval(type)
      if (index !== this.state.activeIntervals[type].index) {
        this.state.activeIntervals[type] = { ...this.state.trackAnalysis[type][index], index }
      }

      const { start, duration } = this.state.activeIntervals[type]
      const elapsed = this.state.trackProgress - start
      this.state.activeIntervals[type].elapsed = elapsed
      this.state.activeIntervals[type].progress = elapsed / duration
    })
  }

  /**
   * @method getVolume - Extract volume data from active segment. 
   */
  getVolume (interval = this.state.activeIntervals.segments) {
    const {
      loudness_max,
      loudness_start,
      loudness_max_time,
      duration,
      elapsed,
      start,
      index
    } = interval

    if (!this.state.trackAnalysis.segments[index + 1]) return 0
    
    const next = this.state.trackAnalysis.segments[index + 1].loudness_start
    const current = start + elapsed
  
    if (elapsed < loudness_max_time) {
      const progress = Math.min(1, elapsed / loudness_max_time)
      return interpolateNumber(loudness_start, loudness_max)(progress)
    } else {
      const _start = start + loudness_max_time
      const _elapsed = current - _start
      const _duration = duration - loudness_max_time
      const progress = Math.min(1, _elapsed / _duration)
      return interpolateNumber(loudness_max, next)(progress)
    }
  }

  /**
   * @method watch - Convenience method for watching data store.
   * @param {string} key 
   * @param {function} method 
   */
  watch (key, method) {
    this.state.watch(key, method)
  }

  /**
   * @method on - Convenience method for applying interval hooks.
   * @param {string} - Interval type. 
   * @param {function} - Event handler. 
   */
  on (interval, method) {
    this.hooks[interval].push(method)
  }

  /**
   * @getter isActive - Returns if class is actively syncing with a playing track. 
   */
  get isActive () {
    return this.state.active === true
  }

  get tatum () {
    return this.state.activeIntervals.tatums
  }

  get segment () {
    return this.state.activeIntervals.segments
  }
  
  get beat () {
    return this.state.activeIntervals.beats
  }

  get bar () {
    return this.state.activeIntervals.bars
  }

  get section () {
    return this.state.activeIntervals.sections
  }

  /**
   * @method getInterval - Convenience method for retreiving active interval of type.
   * @param {string} type - Interval type, e.g. `beat` or `tatum`
   */
  getInterval (type) {
    return this.state.activeIntervals[type + 's']
  }

  /**
   * @method registerVolumeQueue - Register a volume analysis stream.
   */
  registerQueue ({ name, totalSamples, smoothing, mode = 'average' }) {
    this.state.volumeQueues[name] = {
      totalSamples,
      smoothing,
      values: [0,1],
      volume: .5,
      average: .5,
      min: 0,
      max: 1,
      mode
    }
  }

  processVolumeQueues (volume) {
    for (let key in this.state.volumeQueues) {
      const queue = this.state.volumeQueues[key]
      queue.values.unshift(volume)
      while (queue.values.length > queue.totalSamples) {
        queue.values.pop()
      }
      queue.average = average(queue.values)
      queue.min = min(queue.values)
      queue.max = max(queue.values)
      const sizeScale = scaleLinear()
        .domain([queue.min, queue.mode === 'average' ? queue.average : queue.max])
      const latest = average(queue.values.slice(0, queue.smoothing))
      queue.volume = sizeScale(latest)
    }
  }

  getVolumeQueue (name) {
    return this.state.volumeQueues[name].volume
  }

  resetVolumeQueues () {
    for (let key in this.state.volumeQueues) {
      const queue = this.state.volumeQueues[key]
      queue.volume = .5
      queue.average = .5
      queue.min= 0
      queue.max = 1
    }
  }

  /**
   * @method tick - A single update tick from the Sync loop. 
   * @param {DOMHighResTimeStamp} now 
   */
  tick (now) {
    requestAnimationFrame(this.tick.bind(this))
    // if (!this.state.active) return

    /** Set track progress and active intervals. */
    this.state.trackProgress = (now - this.state.initialStart) + this.state.initialTrackProgress
    this.setActiveIntervals()

    /** Get current volume. */
    const volume = this.getVolume()
    const queues = this.state.queues

    this.processVolumeQueues(volume)

    /** Add volume value to the beginning of the volume queue. */
    queues.volume.unshift(volume)

    while (queues.volume.length > this.state.volumeAverage) {
      queues.volume.pop()
    }

    /** Add volume value to the beginning of the beat queue. */
    queues.beat.unshift(volume)

    while (queues.beat.length > this.state.volumeSmoothing) {
      queues.beat.pop()
    }

    function average (arr) {
      return arr.reduce((a, b) => (a + b)) / arr.length
    }

    /** Scale volume (dB) to a linear range using the minimum and average values of the volume queue. */
    const sizeScale = scaleLog()
      .domain([min(queues.volume), average(queues.volume)])

    /** Average the beat queue, then pass it to our size scale. */
    const beat = average(queues.beat)
    this.volume = sizeScale(beat)
  }

  getFutureVolume (index) {
    const loudness = this.state.trackAnalysis.segments[index].loudness_start
    const queues = {...this.state.queues}

    queues.volume.unshift(loudness)

    while (queues.volume.length > this.state.volumeAverage) {
      queues.volume.pop()
    }

    queues.beat.unshift(loudness)

    while (queues.beat.length > this.state.volumeSmoothing) {
      queues.beat.pop()
    }

    function average (arr) {
      return arr.reduce((a, b) => (a + b)) / arr.length
    }

    const sizeScale = scaleLog()
      .domain([min(queues.volume), average(queues.volume)])

    const beat = average(queues.beat)
    return sizeScale(beat)
  }

  buildStaticIntervals (base) {
    const analysis = {}
    const duration = {
      beats: base,
      tatums: [base * (2/3), base * (1/3)],
      segments: base/2,
      sections: base * 16,
      bars: base * 4
    }

    const types = ['tatums', 'segments', 'beats', 'bars', 'sections']
  
    types.forEach(type => {
      analysis[type] = []
  
      for (var i = 0; i < 10000; i++) {
        const tatumStart = analysis.tatums[i - 1]
          ? Math.round(analysis.tatums[i - 1].start + analysis.tatums[i - 1].duration)
          : 0
          
        const tatumDuration = (i % 2 === 0)
          ? Math.round(duration.tatums[0])
          : Math.round(duration.tatums[1])
        
        analysis[type].push({
          start: (type === 'tatums')
            ? tatumStart
            : i * duration[type],
          duration: (type === 'tatums')
            ? tatumDuration
            : duration[type],
          loudness_start: -30 + ((i / 10000) * 20),
          loudness_max: -25 + ((i / 10000) * 20),
          loudness_max_time: (.5 * duration[type])
        })
      }
    })

    return analysis
  }
}

export async function auth () {
  // eslint-disable-next-line 
  const { data } = await get(`${PROJECT_ROOT}/auth`)
  // eslint-disable-next-line 
  window.location.href = `${PROJECT_ROOT}/login?auth_id=${data.auth_id}`
}
