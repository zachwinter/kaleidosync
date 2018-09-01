import SpotifyConnect from './spotify-connect'
import Toast from './toast'

class Visualizer extends SpotifyConnect {
  constructor(demo, interval) {
    super(demo, interval)
    
    this.audio = document.querySelector('audio')
    this.active = false
    this.initialized = false
    this.toast = new Toast
    this.pinging = false
    this.pingInterval = {}
    this.events = {
      beforeInit: () => {},
      afterInit: () => {},
      beforeStart: () => {},
      afterStart: () => {},
      beforeStop: () => {},
      afterStop: () => {}
    }
  }

  initializeVisualizer() {
    this.getCurrentlyPlaying()
      .then((response) => this.processResponse(response))
      .catch((err) => console.log(err))
  }

  startVisualizer() {  
    this.toast.nowPlaying({
      title: this.currentlyPlaying.item.name,
      album: this.currentlyPlaying.item.album.name,
      artist: this.currentlyPlaying.item.artists[0].name,
      artwork: this.currentlyPlaying.item.album.images[0].url
    })

    if (this.initialized === false) {
      this.events.beforeInit.bind(this).call()
      this.initialized = true
      this.events.afterInit.bind(this).call()
    }

    this.events.beforeStart.bind(this).call()
    this.setIntervalHooks()
    this.initializeHooks()
    this.active = true
    this.events.afterStart.bind(this).call()
  }

  startVisualizerDemo() {
    this.audio.src = `/data/song.mp3`
    this.audio.play()

    const canPlayThrough = () => {
      this.trackProgress = { 
        progress: this.audio.currentTime * 100,
        timestamp: window.performance.now()
      }
      this.startVisualizer()
      this.audio.removeEventListener('canplaythrough', canPlayThrough)
    }

    this.audio.addEventListener('canplaythrough', canPlayThrough)
  }

  stopVisualizer() { 
    this.events.beforeStop.bind(this).call()
    this.removeHooks()
    this.updateTrackProgress(0, true) 
    this.active = false
    this.events.afterStop.bind(this).call()
  }

  processResponse(response) {
    if (!response.item) {
      this.toast.notPlaying()

      if (this.active) {
        this.stopVisualizer()
      }

      return
    }

    const getData = (timestamp) => {
      clearInterval(this.pingInterval)
      Promise.all([
        this.getTrackFeatures(),
        this.getTrackAnalysis()
      ]).then((responses) => {
        this.trackFeatures = responses[0]
        this.trackAnalysis = responses[1]
        this.updateTrackProgress(response.delay + (window.performance.now() - timestamp))
        if (this.demo === true) {
          this.startVisualizerDemo()
        } else {
          this.startVisualizer()
          this.startPing()
        }
      })
    }

    if (this.active) {
      if (response.is_playing === false) {
        this.stopVisualizer()
        this.toast.notPlaying()
        if (!this.pinging) { this.startPing() }
        return
      }

      if (JSON.stringify(this.currentlyPlaying.item) !== JSON.stringify(response.item)) {
        this.stopVisualizer()
        this.currentlyPlaying = response
        getData(window.performance.now())
        return
      }
    }

    if (!this.active && response.is_playing === false) {
      this.toast.notPlaying()
    }

    if (!this.active && response.is_playing === true) {    
      this.currentlyPlaying = response
      getData(window.performance.now())
    } 

    if (!this.pinging && !this.demo) {
      this.startPing()
    }
  }

  startPing() {    
    clearInterval(this.pingInterval)
    this.pingInterval = setInterval(() => {
      console.log('Ping...')
      this.getCurrentlyPlaying()
        .then((response) => this.processResponse(response))
        .catch((err) => console.log(err))
    }, 5000)
  }
}
 
export default Visualizer 