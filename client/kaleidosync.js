import state from './state'
import { createCanvas, sizeCanvasArtboard } from './util/canvas'
import {
  initParameters, 
  initState,
  setApiTokens,
  setColorScheme, 
  setStarRadius, 
  setStarColor, 
  setBackgroundColor, 
  setActiveSize,
  setActiveIntervals,
  setInitialStart,
  setTrackProgress,
  paint
} from './state/mutations'
import { ping } from './state/actions'

export default class Kaleidosync {
  constructor () {
    this.state = state
    this.canvas = createCanvas()
    this.ctx = this.canvas.getContext('2d')
    sizeCanvasArtboard(this.canvas)

    setApiTokens(this.state)
    initParameters(this.state)
    initState(this.state, this.canvas)

    this.watch()
    
    window.addEventListener('resize', () => {
      initParameters(this.state)
      sizeCanvasArtboard(this.canvas)
    })

    ping(this.state)
  }

  /**
   * @method watch – Attach event handlers to changes in state.
   */
  watch () {
    /** Start & stop visualizer based on `active` property. */
    this.state.visualizer.watch('active', val => {
      if (val === true) {
        this.start()
      } else {
        this.stop()
      }
    })	

    const intervals = this.state.visualizer.activeIntervals

    intervals.watch('tatums', () => setStarRadius(this.state, 'tatums'))
    intervals.watch('segments', () => setActiveSize(this.state))
    intervals.watch('beats', () => {
      setStarColor(this.state, 'beats')
      setBackgroundColor(this.state, 'beats')
    })
    intervals.watch('bars', ({ index }) => {
      if (index % 4 === 0) {
        setColorScheme(this.state)
      }
    })
  }

  /**
   * @method start – Set start time and initialize animation loop with `requestAnimationFrame`
   */
  start () {
    setInitialStart(state)
    requestAnimationFrame(this.paint.bind(this))
  }

  /**
   * @method stop – Stop animation loop with `cancelAnimationFrame`
   */
  stop () {
    cancelAnimationFrame(this.paint)
  }

  /**
   * @method paint – Paint a single frame of animation loop.
   * @param now – High resolution timestamp.
   */
  paint (now) {
    if (this.state.visualizer.active === true) {
      requestAnimationFrame(this.paint.bind(this))
    }
      
    const progress = (now - this.state.visualizer.initialStart) + this.state.visualizer.initialTrackProgress
    setTrackProgress(this.state, progress)
    setActiveIntervals(this.state)
    paint(this.state, {
      canvas: this.canvas,
      ctx: this.ctx
    })
  }
}