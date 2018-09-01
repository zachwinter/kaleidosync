import Axios from '../lib/axios.min'
import Cookies from '../lib/js.cookie'

class SpotifyConnect {
  constructor(demo) {
    this.demo = demo

    this.accessToken = Cookies.get('KALEIDOSYNC_ACCESS_TOKEN')
    this.refreshToken = Cookies.get('KALEIDOSYNC_REFRESH_TOKEN')
    this.refreshCode = Cookies.get('KALEIDOSYNC_REFRESH_CODE')

    try {
      this.api = Axios.create({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
          Accept: 'application/json'
        }
      })
    } catch(err) {
      console.log(err)
    }

    this.currentlyPlaying = {}
    this.trackAnalysis = {} 
    this.trackProgress = {}
    this.trackFeatures = {}

    this.intervals = {
      types: ['tatums', 'segments', 'beats', 'bars', 'sections'],
      active: {},
      next: {},
      last: {},
      initial: {},
      hooks: {}
    }

    this.intervals.types.forEach((type) => {
      this.intervals.active[type] = {}
      this.intervals.next[type] = {}
      this.intervals.last[type] = {}
      this.intervals.initial[type] = {}
      this.intervals.hooks[type] = () => {}
    })
  }

  getCurrentlyPlaying() {
    const delay = window.performance.now()

    if (this.demo) {
      return new Promise((resolve, reject) => {
        Axios.get('/data/currently-playing.json')
          .then((res) => resolve({...res.data, delay: window.performance.now() - delay}))
          .catch((err) => reject(err))
      })
    }

    return new Promise((resolve, reject) => {
      this.api.get('/me/player/currently-playing')
        .then((res) => resolve({...res.data, delay: window.performance.now() - delay}))
        .catch((err) => reject(err))
    })
  }

  getTrackFeatures() {
    if (this.demo) {
      return new Promise((resolve, reject) => {
        Axios.get('/data/track-features.json')
          .then((res) => resolve(res.data))
          .catch((err) => reject(err))
      })
    }

    return new Promise((resolve, reject) => {
      this.api.get(`/audio-features/${this.currentlyPlaying.item.id}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }

  getTrackAnalysis() {
    if (this.demo) {
      return new Promise((resolve, reject) => {
        Axios.get('/data/track-analysis.json')
          .then((res) => resolve(res.data))
          .catch((err) => reject(err))
      })
    }

    return new Promise((resolve, reject) => {
      this.api.get(`/audio-analysis/${this.currentlyPlaying.item.id}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }

  updateTrackProgress(delay, reset) {
    if (reset) {
      this.trackProgress = {
        progress: 0,
        timestamp: window.performance.now()
      }
      return
    }

    if (delay) {
      this.trackProgress = {
        progress: this.currentlyPlaying.progress_ms + delay,
        timestamp: window.performance.now()
      }
      return
    } 

    this.trackProgress = { 
      progress: this.trackProgress.progress + (window.performance.now() - this.trackProgress.timestamp),
      timestamp: window.performance.now()
    }
  }

  determineInitialIntervals(type) {
    for (let i = 0; i < this.trackAnalysis[type].length; i++) {
      this.updateTrackProgress()

      /** If last interval... */
      if (i === (this.trackAnalysis[type].length - 1)) {
        this.intervals.active[type] = this.trackAnalysis[type][i]
        this.intervals.initial[type] = this.trackAnalysis[type][i]
        this.intervals.active[type].index = i
        this.intervals.initial[type].index = i

        return
      }

      /** If current track progress falls within current interval. */
      if (this.trackAnalysis[type][i].start < this.trackProgress.progress/1000 && this.trackProgress.progress/1000 < this.trackAnalysis[type][i + 1].start) {
        this.intervals.active[type] = this.trackAnalysis[type][i]
        this.intervals.initial[type] = this.trackAnalysis[type][i]
        this.intervals.next[type] = this.trackAnalysis[type][i + 1]
        this.intervals.active[type].index = i
        this.intervals.initial[type].index = i
        this.intervals.next[type].index = i + 1
        break
      }
    }
  }

  executeIntervalHooks(type, interval, index, initialize) {       
    this.intervals.active[type] = interval
    this.intervals.next[type] = this.trackAnalysis[type][index + 1] || null
    this.intervals.last[type] = this.trackAnalysis[type][index - 1] || null

    if (typeof this.intervals.hooks[type] === 'function') {
      this.updateTrackProgress()
      this.intervals.hooks[type].bind(this, index).call()
      this.updateTrackProgress()
    }

    let recursionDelay = 0

    if (initialize === true) {      
      recursionDelay = (this.intervals.next[type].start * 1000) - this.trackProgress.progress
    } else {
      recursionDelay = (interval.duration * 1000) - (this.trackProgress.progress - (interval.start * 1000))
    }
    this.intervals.active[type].timeout = setTimeout(() => {
      this.executeIntervalHooks(type, this.intervals.next[type], index + 1, false)
    }, recursionDelay)
  }

  removeHooks() {
    this.intervals.types.forEach((type) => {
      delete this.intervals.hooks[type]
    });
  }

  initializeHooks() {    
    this.intervals.types.forEach((type) => {
      this.trackAnalysis[type][0] = {
        ...this.trackAnalysis[type][0], 
        start: 0,
        duration: this.trackAnalysis[type][0].start + this.trackAnalysis[type][0].duration
      }

      this.determineInitialIntervals(type)
      this.executeIntervalHooks(type, this.intervals.active[type], this.intervals.active[type].index, true)
    })
  }
}

export default SpotifyConnect