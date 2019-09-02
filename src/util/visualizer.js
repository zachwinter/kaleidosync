import Sync from './sync'
import Sketch from './sketch'

export default class Visualizer {
  constructor ({
    volumeSmoothing = 100, 
    volumeAverage = 400,
    width = window.innerWidth,
    height = window.innerHeight,
    hidpi = true,
    container = document.body,
    fixed = false,
    staticIntervalBaseDuration,
    syncOnly = false,
    parent = null,
    name = '',
    $store = null,
    staticFactory = function (i) { return i }
  } = {}) {
    /** Initialize Sync class. */

    if (parent) {
      this.sync = parent.sync
      this.sketch = parent.sketch
      return this.hooks()
    } 

    this.sync = new Sync({
      volumeSmoothing,
      fixed,
      staticIntervalBaseDuration,
      staticFactory,
      volumeAverage,
      $store
    })

    if (syncOnly === false) {
      /** Initialize Sketch class. Assign `this.paint` as the main animation loop. */
      this.sketch = new Sketch({
        main: this.paint.bind(this),
        hidpi,
        width,
        height,
        container,
        name
      })

      this.watch()
    }

    this.hooks()

    if (syncOnly === false) {
      if (this.sync.fixed) {
        this.sketch.start()
      }
    }
  }

  /**
   * @method watch - Watch for changes in state.
   */
  watch () {
    this.sync.watch('active', val => {
      /** Start and stop sketch according to the `active` property on our Sync class. */
      if (val === true) {
        this.sketch.start()
      } else {
        this.sketch.stop()
      }
    })
  }

  /**
   * @method hooks - Attach hooks to interval change events. 
   */
  hooks () {

  }

  /**
   * @method paint - Paint a single frame of the main animation loop.
   */
  paint () {

  }
}