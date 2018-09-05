import Cookies from '../lib/js.cookie'

class SpotifyConnect {
  constructor() {
    this.accessToken = Cookies.get('KALEIDOSYNC_ACCESS_TOKEN')
    this.refreshToken = Cookies.get('KALEIDOSYNC_REFRESH_TOKEN')
    this.refreshCode = Cookies.get('KALEIDOSYNC_REFRESH_CODE')
    this.headers = {
      Authorization: 'Bearer ' + this.accessToken,
      Accept: 'application/json'
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

    this.onTrackComplete = () => {}
  }

  GetJSON(url) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest()
      request.open('GET', url, true)
      for (var header in this.headers) {
        if (this.headers.hasOwnProperty(header)) {
          request.setRequestHeader(header, this.headers[header])
        }
      }
      request.onload = function() {
        if (request.status !== 200) {
          reject('ERROR')
        } else {
          resolve(JSON.parse(request.responseText))
        }
      }
      request.onerror = () => reject('ERROR')
      request.send()
    })
  }

  getCurrentlyPlaying() {
    const delay = window.performance.now()

    return new Promise((resolve, reject) => {
      this.GetJSON('https://api.spotify.com/v1/me/player/currently-playing')
        .then((res) => resolve({...res, delay: window.performance.now() - delay}))
        .catch((err) => reject(err))
    })
  }

  getTrackFeatures() {
    return this.GetJSON(`https://api.spotify.com/v1/audio-features/${this.currentlyPlaying.item.id}`)
  }

  getTrackAnalysis() {
    return this.GetJSON(`https://api.spotify.com/v1/audio-analysis/${this.currentlyPlaying.item.id}`)
  }

  updateTrackProgress(delay, reset) {
    if (reset) {
      this.trackProgress = {
        progress: 0,
        timestamp: 0
      }
      return
    }

    if (delay) {
      this.trackProgress = {
        progress: this.currentlyPlaying.progress_ms + delay,
        timestamp: window.performance.now()
      }
    } else {
      this.trackProgress = {
        progress: this.trackProgress.progress + (window.performance.now() - this.trackProgress.timestamp),
        timestamp: window.performance.now()
      }
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
    this.intervals.active[type].index = index
    
    if (typeof this.intervals.hooks[type] === 'function') {
      this.updateTrackProgress()
      this.intervals.hooks[type].call()
      this.updateTrackProgress()
    }

    if (!this.intervals.next[type]) {
      if (type === 'tatums') {
        this.onTrackComplete.bind(this).call()
      }
      return
    }
    
    let recursionDelay = 0

    if (initialize === true) {      
      recursionDelay = (this.intervals.next[type].start * 1000) - this.trackProgress.progress
    } else {
      recursionDelay = (interval.duration * 1000) - (this.trackProgress.progress - (interval.start * 1000))
    }

    if (this.intervals.next[type] !== null) {
      this.intervals.active[type].timeout = setTimeout(() => {
        this.executeIntervalHooks(type, this.intervals.next[type], index + 1, false)
      }, recursionDelay)
    }
  }

  removeHooks() {
    this.intervals.types.forEach((type) => {
      clearTimeout(this.intervals.active[type].timeout)
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