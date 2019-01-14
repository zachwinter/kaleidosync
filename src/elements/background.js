import { interpolateRGB } from '../util/interpolate'

export default class Background {
  constructor ({
    width,
    height,
    color
  }) {
    this.width = width
    this.height = height
    this.color = {
      active: color,
      last: color,
      next: color
    }
  }

  update ({ val, interval }) {
    this.color.last = this.color.next
    this.color.next = val,
    this.color.interval = interval
  }

  draw ({ ctx, width, height, trackProgress }) {
    const progress = Math.min((trackProgress - this.color.interval.start) / this.color.interval.duration, 1)
    this.color.active = interpolateRGB(this.color.last, this.color.next)(progress)
    ctx.fillStyle = this.color.active
    ctx.fillRect(0, 0, width, height)
  }
}