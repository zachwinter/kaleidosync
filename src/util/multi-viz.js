import Visualizer from './visualizer'
import Kaleidosync from '../sketches/kaleidosync'
import Trails from '../sketches/trails'
import Wavesync from '../sketches/wavesync'
import Blobs from '../sketches/blobs'

export default class MultiViz extends Visualizer {
  constructor (initial = 'kaleidosync') {
    super({ hidpi: (window.innerWidth * window.innerHeight) <= (400 * 900) })

    this.selectedVisualizer = initial
    this.kaleidosync = new Kaleidosync({ parent: this })
    this.trails = new Trails({ parent: this })
    this.wavesync = new Wavesync({ parent: this })
    this.blobs = new Blobs({ parent: this })
  }

  paint (args) {
    if (this.selectedVisualizer === 'trails') {
      this.trails.paint(args)
    }

    if (this.selectedVisualizer === 'kaleidosync') {
      this.kaleidosync.paint(args)
    }

    if (this.selectedVisualizer === 'wavesync') {
      this.wavesync.paint(args)
    }

    if (this.selectedVisualizer === 'blobs') {
      this.blobs.paint(args)
    }
  }
}