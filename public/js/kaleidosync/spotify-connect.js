import Toast from './elements/toast'
 
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
    this.trackFeatures = {}
    this.initialTrackProgress = 0
    this.trackProgress = 0
    this.active = false
    this.initialized = false
    this.trustServer = true
    this.errorThreshold = 150
    this.errorLimit = 4
    this.errorCount = 0
    this.tempStatic = false

    this.intervals = {
      types: ['tatums', 'segments', 'beats', 'bars', 'sections'],
      active: {}
    }

    this.intervals.types.forEach((type) => {
      this.intervals.active[type] = {}
    })

    this.events = {
      beforeInit: () => {},
      afterInit: () => {},
      beforeStart: () => {},
      afterStart: () => {},
      beforeStop: () => {},
      afterStop: () => {},
      setStatic: () => {}
    }

    this.toast = new Toast 
  }

  /**
   * Fetch data from Spotify API.
   * @param {string} url 
   * @returns {Promise} 
   */
  fetch(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', url, true)

      for (var header in this.headers) {
        request.setRequestHeader(header, this.headers[header])
      }

      request.onload = () => {
        if (request.status == 200) {
          resolve(JSON.parse(request.responseText))
        } 

        if (request.status === 204) {
          reject('No currently playing track was found.')
        }

        if (request.status === 401) {
          this.getNewToken()
          reject('Token expired.')
        }
      }

      request.onerror = () => reject('Something strange happened.')
      request.send()
    })
  }

  /**
   * Get new access token from back end. 
   */
  getNewToken() {
    const request = new XMLHttpRequest()
    request.open('GET', `/refresh?token=${this.refreshToken}`, true)
    request.onload = () => {
      if (request.status === 200) {
        const res = JSON.parse(request.responseText)
        this.accessToken = res.access_token
        this.headers = {
          Authorization: 'Bearer ' +  this.accessToken,
          Accept: 'application/json'
        }
        Cookies.set('KALEIDOSYNC_ACCESS_TOKEN', res.access_token)
      }
    }
    request.send()
  }

  /**
   * Fetch currently playing track, if any.
   * @returns {Promise} 
   */
  getCurrentlyPlaying() {
    const latency = window.performance.now()
    return new Promise((resolve, reject) => {
      this.fetch('https://api.spotify.com/v1/me/player')
        .then((res) => resolve({...res, latency}))
        .catch((err) => reject({...err, latency}))
    })
  }

  /**
   * Get audio features and audio analysis for a given track.
   * @param {object} track – response from `getCurrentlyPlaying()`
   */
  getTrackData (track) {
    this.toast.syncing()
    Promise.all([
      this.fetch(`https://api.spotify.com/v1/audio-features/${track.item.id}`),
      this.fetch(`https://api.spotify.com/v1/audio-analysis/${track.item.id}`)
    ]).then((responses) => {
			const offset = Math.abs((Date.now() - track.timestamp) - (track.progress_ms + (window.performance.now() - track.latency)))
			this.trustServer = offset < this.errorThreshold
      this.stopVisualizer()
      this.currentlyPlaying = track
      this.trackFeatures = responses[0]
      this.trackAnalysis = responses[1]
      this.initializeIntervals()
      this.initialTrackProgress = this.trustServer ? Date.now() - track.timestamp : track.progress_ms + (window.performance.now() - track.latency)
      this.startVisualizer()
      this.pingSpotify()
    }).catch((err) => console.log(err))
  }

  /**
   * Process Spotify API response.
   * @param {object} response 
   */
  processResponse(response) {
    const songsInSync = JSON.stringify(this.currentlyPlaying.item) === JSON.stringify(response.item)

    if (this.active && response.is_playing) {
      /**
       * `Date.now() - response.timestamp` gives us the current track progress in millisecond accuracy.
       * If a user manually seeks through a track, we lose the ability to calculate this.
       * 
       * It's almost definitely not supposed to work that way – I filed an issue about it here:
       * https://github.com/spotify/web-api/issues/1073
       * 
       * HACK: Determine if a user has manually seeked through a track by calculating the the difference between
       * the server response's stated `progress_ms` and our derived value `Date.now() - response.timestamp`
       * 
       * We'll switch to `response.progress_ms` after 5 (this.errorLimit) consecutive offsets that are out of
       * our range (this.errorThreshold).
       */
      const offset = this.trustServer ? Math.abs((Date.now() - response.timestamp) - response.progress_ms) : Math.abs(response.progress_ms - this.trackProgress)
      
      console.log(`Sync Offset: ${parseInt(offset, 10)}ms ${this.trustServer ? '(Trust: TRUE)' : '(Trust: FALSE)'}`)
      
      if (offset >= this.errorThreshold) {
        this.errorCount++
      } else {
        this.errorCount = 0
      }

      /** If we hit our error limit, stop trusting server and adjust initial track progress using `response.progress_ms`. */
      if (this.errorCount === this.errorLimit) {
        console.log('Re-syncing using `progress_ms`')
        this.trustServer = false
        this.errorCount = 0
        this.stopVisualizer()
				this.initialTrackProgress = response.progress_ms + ((window.performance.now() - response.latency))
        this.startVisualizer(true)
        return this.pingSpotify()
      }
    }

    /**
     * If visualizer is inactive but a song is playing, fire 'er up. 
     */
    if (!this.active && response.is_playing) {
      /** Use cached track analysis data if available. */
      if (songsInSync) {
        this.startVisualizer()
        return this.pingSpotify()
      }

      return this.getTrackData(response)
    }

    /** If server response indicates no currently playing song, stop visualizer if active and ping. */
    if (typeof response !== 'object' || !response.is_playing) {
      if (this.active) {
        this.stopVisualizer()
      } else {
        this.toast.notPlaying()
			}
			
			if (this.tempStatic === false) {
				this.events.setStatic()
				this.tempStatic = true
			}

      return this.pingSpotify()
    }

    /** If visualizer is processing the same song as the server response, ping. */
    if (songsInSync) {
      return this.pingSpotify()
    }

    /** If none of the above applies, get track data and pray. */
    this.getTrackData(response)
  }

  /**
   * Determine active interval of type, per track progress.
   * @param {string} type 
   * @returns {number} i – Index of interval.
   */
  determineInterval(type) {
    for (let i = 0; i < this.trackAnalysis[type].length; i++) {
      /** If last interval... */
      if (i === (this.trackAnalysis[type].length - 1)) {
        return i
      }

      /** If current track progress falls within current interval. */
      if (this.trackAnalysis[type][i].start < this.trackProgress && this.trackProgress < this.trackAnalysis[type][i + 1].start) {
        return i
      }
    }

    return -1
  }

  /**
   * Track analysis data doesn't always cover the entire span of the song. So...
   */
  initializeIntervals() {    
    console.log('initializeIntervals()')

    this.intervals.types.forEach((type) => {
      /** Ensure first interval of each type starts at zero. */
      this.trackAnalysis[type][0] = {
        ...this.trackAnalysis[type][0], 
        start: 0,
        duration: this.trackAnalysis[type][0].start + this.trackAnalysis[type][0].duration
      }

      /** Ensure last interval of each type ends at the very end of the track. */
      this.trackAnalysis[type][this.trackAnalysis[type].length - 1] = {
        ...this.trackAnalysis[type][this.trackAnalysis[type].length - 1],
        start: this.trackAnalysis[type][this.trackAnalysis[type].length - 1].start,
        duration: (this.currentlyPlaying.item.duration_ms/1000) - this.trackAnalysis[type][this.trackAnalysis[type].length - 1].start
      }

      /** Convert every time value to milliseconds for our later convenience. */
      this.trackAnalysis[type].forEach((interval) => {
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
      })
    })
  }

  /**
   * Set interval of type as active.
   * @param {string} type – Type of interval.
   * @param {number} index – Index of interval within track analysis data.
   */
  setActiveInterval(type, index) {
    this.intervals.active[type] = {
      ...this.trackAnalysis[type][index],
      index
    }
  }

  /**
   * Start visualizer and execute event hooks.
   */
  startVisualizer(hideToast) {  
		if (this.active) {
			return
		}

    console.log('startVisualizer()')

    this.tempStatic = false

    this.events.beforeStart()
    this.active = true
    this.events.afterStart()

    if (this.initialized === false) {
      this.events.beforeInit()
      this.initialized = true
      this.events.afterInit()
		}
		
    if (hideToast === true) {
      return
    }

    const { item } = this.currentlyPlaying

    this.toast.nowPlaying({
      title: item.name,
      artist: item.artists[0].name,
      artwork: item.album.images[0].url
    })
  }

  /**
   * Stop visualizer and execute event hooks.
   */
  stopVisualizer() { 
		if (!this.active) {
			return
		}

    console.log('stopVisualizer()')

    this.events.beforeStop.call()
    this.active = false
    this.events.afterStop.call()
  }

  /**
   * Fetch and process currently playing track.
   * @param {boolean} skipDelay – If true, ping Spotify immediately.
   */
  pingSpotify(skipDelay) {
    setTimeout(() => {
      this.getCurrentlyPlaying()
        .then((response) => this.processResponse(response))
        .catch((err) => this.processResponse(err))
    }, skipDelay ? 0 : 1000)    
  }
}

export default SpotifyConnect