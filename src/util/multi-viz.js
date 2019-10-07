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
        this.trails.paint(args)
        break
      case 'kaleidosync':
        this.kaleidosync.paint(args)
        break
      case 'wavesync':
        this.wavesync.paint(args)
        break
      case 'blobs':
        this.blobs.paint(args)
        break
      default:
        return
    }
  }
}