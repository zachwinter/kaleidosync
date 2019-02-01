import state from './state'
import {
  setInitialModel,
  setSizeParams, 
  setApiTokens,
  setColorScheme, 
  setStarRadius, 
  setStarColor, 
  setBackgroundColor, 
  setActiveSize,
  setActiveIntervals,
  setTrackProgress
} from './state/mutations'
import { ping } from './state/actions'
import {
  createCanvas, 
  sizeCanvasArtboard,
  createPath,
  createStar,
  fillCanvas
} from './util/canvas'

export default class Kaleidosync {
  constructor () {
    this.state = state
    setApiTokens(this.state)
    setSizeParams(this.state)

    this.canvas = createCanvas()
    this.ctx = this.canvas.getContext('2d')
    sizeCanvasArtboard(this.canvas)

    setInitialModel(this.state, this.canvas)
    
    this.watch()

    window.addEventListener('resize', () => {
      setSizeParams(this.state)
      sizeCanvasArtboard(this.canvas)
    })

    ping(this.state)

    requestAnimationFrame(this.paint.bind(this))
  }

  /**
   * @method watch – Attach event handlers to changes in state.
   */
  watch () {
    const intervals = this.state.visualizer.activeIntervals

    intervals.watch('tatums', () => {
      setStarRadius(this.state, 'tatums')
    })

    intervals.watch('segments', () => {
      setActiveSize(this.state)
    })

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
   * @method paint – Paint a single frame of animation loop.
   * @param now – High resolution timestamp.
   */
  paint (now) {
    requestAnimationFrame(this.paint.bind(this))

    if (this.state.visualizer.active === false) return
    
    const trackProgress = (now - this.state.visualizer.initialStart) + this.state.visualizer.initialTrackProgress

    setTrackProgress(this.state, trackProgress)
    setActiveIntervals(this.state)

    fillCanvas(this.ctx, this.state.visualizer.background.get(trackProgress))

    this.state.visualizer.stars.forEach((star, i) => {
      const color = star.color.get(trackProgress)
      const inner = star.innerRadius.get(trackProgress)
      const outer = star.outerRadius.get(trackProgress)
      const rotation = trackProgress / 70
      const vertices = createStar(star.points, inner, outer, this.canvas.width/2, this.canvas.height/2, rotation)    
      this.ctx.fillStyle = color
      createPath(this.ctx, vertices).fill()
    })
  }
}