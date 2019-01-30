import { interpolateRGB } from '../util/interpolate'
import ease from '../util/easing'

export default class Background {
  constructor (color) {
    this.color = {
      last: color,
      next: color,
      interval: {}
    }
  }

  update ({ val, interval }) {
    this.color.last = this.color.next
    this.color.next = val,
    this.color.interval = interval
  }

  getColor (trackProgress) {
    const start = this.color.interval.start
    const duration = this.color.interval.duration
    const progress = ease(Math.min((trackProgress - start) / duration, 1))

    return interpolateRGB(this.color.last, this.color.next)(progress)
  }

  draw ({ ctx, width, height, trackProgress }) {
    ctx.fillStyle = this.getColor(trackProgress)
    ctx.fillRect(0, 0, width, height)
  }
}