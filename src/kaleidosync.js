import state from './state'
import { initCanvas } from './util/canvas'
import {
  initParameters, 
  initState,
  setTokens,
  setColorScheme, 
  setStarRadius, 
  setStarColor, 
  setBackgroundColor, 
  setActiveSize,
  setActiveIntervals,
  setInitialStart,
  setTrackProgress,
  resizeElements,
  paint
} from './state/mutations'
import { ping } from './state/actions'

export default class Kaleidosync {
  constructor () {
    /** Initialize <canvas> and 2d context. */
    const { canvas, ctx } = initCanvas()
    this.canvas = canvas
    this.ctx = ctx
    
    /** Initialize reactive app state. */
    this.state = state

    /** Get API tokens from cookies. */
    setTokens(this.state)
    
    /** Initialize visualizer parameters and initial state. */
    initParameters(this.state)
    initState(this.state, this.canvas)

    /** Watch for changes in state. */
    this.watch()
    
    /** Adjust visualizer on window resize. */
    window.addEventListener('resize', () => resizeElements(this.state, this.canvas))

    /** Ping Spotify for currently playing track. */
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

    /** On every tatum change, set star radius. */
    intervals.watch('tatums', () => setStarRadius(this.state, 'tatums'))

    /** On every segment change, set active size. */
    intervals.watch('segments', () => setActiveSize(this.state))

    /** On every beat, set star & background color. */
    intervals.watch('beats', () => {
      setStarColor(this.state, 'beats')
      setBackgroundColor(this.state, 'beats')
    })

    /** On every fourth bar, set active color scheme. */
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
   * @param timestamp – High resolution timestamp.
   */
  paint (timestamp) {
    if (this.state.visualizer.active === true) {
      requestAnimationFrame(this.paint.bind(this))
    }
      
    /** progress = (now - initialStart) + initialTrackProgress */
    setTrackProgress(this.state, (timestamp - this.state.visualizer.initialStart) + this.state.visualizer.initialTrackProgress)

    /** Based on track progress, determine active intervals. */
    setActiveIntervals(this.state)

    /** Paint elements based on track progress and active intervals. */
    paint(this.state, {
      canvas: this.canvas,
      ctx: this.ctx
    })
  }
}