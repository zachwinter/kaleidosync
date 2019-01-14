import state from './state'
import { initCanvas, sizeCanvas } from './util/canvas'
import {
  initParameters, 
  initState,
  setTokens,
  setColorScheme, 
  setStarRadius, 
  setStarColor, 
  setBackgroundColor, 
  setActiveSize,
  setActiveInterval,
  setInitialStart,
  setTrackProgress
} from './state/mutations'
import { ping } from './state/actions'

export default class Kaleidosync {
  constructor () {
    const { canvas, ctx } = initCanvas()
    this.canvas = canvas
    this.ctx = ctx
    this.state = state

    /** Get API tokens from cookies. */
    setTokens(this.state)
    /** Initialize visualizer parameters and initial state. */
    initParameters(this.state)
    initState(this.state, this.canvas)

    this.watch()
    this.onResize()

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

    /** On every fourth bar, set actvie color scheme. */
    intervals.watch('bars', ({ index }) => {
      if (index % 4 === 0) {
        setColorScheme(this.state)
      }
    })
  }

  /**
   * @method onResize – Adjust <canvas> and stars on window resize.
   */
  onResize () {
    window.addEventListener('resize', () => {
      initParameters(this.state)
      sizeCanvas(this.canvas)

      this.state.visualizer.stars.forEach(star => {
        star.x = this.canvas.width / 2
        star.y = this.canvas.height / 2
      })
    })
  }

  /**
   * @method determineInterval – Determine and return active interval index of type, based on current track progress.
   * @param type – Type of interval.
   */
  determineInterval(type) {
    for (let i = 0; i < this.state.visualizer.trackAnalysis[type].length; i++) {
      /** If last interval... */
      if (i === (this.state.visualizer.trackAnalysis[type].length - 1)) {
        return i
      }

      /** If current track progress falls within current interval. */
      if (this.state.visualizer.trackAnalysis[type][i].start < this.state.visualizer.trackProgress && this.state.visualizer.trackProgress < this.state.visualizer.trackAnalysis[type][i + 1].start) {
        return i
      }
    }

    return -1
  }

  /**
   * @method start – Set start time and initialize animation loop with `requestAnimationFrame`
   */
  start () {
    setInitialStart(state)
    requestAnimationFrame(this.paint.bind(this))
  }

  /**
   * @method stop – Stop animatiton loop with `cancelAnimationFrame`
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
    setTrackProgress(state, (timestamp - this.state.visualizer.initialStart) + this.state.visualizer.initialTrackProgress)

    /** For each interval type... */
    this.state.visualizer.intervalTypes.forEach(type => {
      const index = this.determineInterval(type)

      /** If determined index is not equal to currently-cached active interval, update active interval. */
      if (!this.state.visualizer.activeIntervals[type].start || index !== this.state.visualizer.activeIntervals[type].index) {
        setActiveInterval(state, { type, index })
      }
    })

    /** Pass <canvas> 2d context, <canvas> width & height, and current track progress to background, then paint. */
    this.state.visualizer.background.draw({
      ctx: this.ctx,
      width: this.canvas.width,
      height: this.canvas.height,
      trackProgress: this.state.visualizer.trackProgress
    })
    
    /** Pass <canvas> 2d context and current track progress to each star, then paint. */
    this.state.visualizer.stars.forEach(star => {
      star.draw({
        ctx: this.ctx,
        trackProgress: this.state.visualizer.trackProgress
      })
    })
  }
}