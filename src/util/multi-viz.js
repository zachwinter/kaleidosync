import Visualizer from './visualizer'
import Kaleidosync from '../sketches/kaleidosync'
import Trails from '../sketches/trails'
import Wavesync from '../sketches/wavesync'
import Blobs from '../sketches/blobs'

const MAX_PIXELS = 400 * 900
const hidpi = (window.innerWidth * window.innerHeight) <= MAX_PIXELS

export default class MultiViz extends Visualizer {
  constructor ($store) {
    super({ $store, hidpi })

    this.selectedVisualizer = $store.state.selectedVisualizer
    this.kaleidosync = new Kaleidosync({ parent: this, hidpi })
    this.trails = new Trails({ parent: this, hidpi })
    this.wavesync = new Wavesync({ parent: this, hidpi })
    this.blobs = new Blobs({ parent: this, hidpi })
  }

  paint (args) {
    switch (this.selectedVisualizer) { 
      case 'trails':
        this.sync.state.volumeSmoothing = 5
        this.sync.state.volumeAverage = 50
        this.trails.paint(args)
        break
      case 'kaleidosync':
        this.sync.state.volumeSmoothing = 50
        this.sync.state.volumeAverage = 400
        this.kaleidosync.paint(args)
        break
      case 'wavesync':
        this.sync.state.volumeSmoothing = 60
        this.sync.state.volumeAverage = 400
        this.wavesync.paint(args)
        break
      case 'blobs':
        this.sync.state.volumeSmoothing = 5
        this.sync.state.volumeAverage = 50
        this.blobs.paint(args)
        break
      default:
        return
    }
  }
}