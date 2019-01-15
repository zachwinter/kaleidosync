import { interpolateNumber, interpolateRGB } from '../util/interpolate'
import { createPath } from '../util/canvas'
import { createStar } from '../util/polar'
import easing from '../util/easing'

export default class Star {
  constructor({
    x, y,
    points,
    color,
    innerRadius,
    outerRadius
  }) {
    this.x = x
    this.y = y
    this.points = points
    
    this.color = {
      last: color,
      next: color,
      interval: {}
    }

    this.innerRadius = {
      last: innerRadius,
      next: innerRadius,
      interval: {}
    }

    this.outerRadius = {
      last: outerRadius,
      next: outerRadius,
      interval: {}
    }
  }

  update ({
    color = null,
    innerRadius = null,
    outerRadius = null,
    points = null
  }) {
    if (color !== null) {
      this.color.last = this.color.next
      this.color.next = color.val,
      this.color.interval = color.interval
    }

    if (innerRadius !== null) {
      this.innerRadius.last = this.innerRadius.next
      this.innerRadius.next = innerRadius.val
      this.innerRadius.interval = innerRadius.interval
    }

    if (outerRadius !== null) {
      this.outerRadius.last = this.outerRadius.next
      this.outerRadius.next = outerRadius.val
      this.outerRadius.interval = outerRadius.interval
    }

    if (points !== null) {
      this.points = points
    }
  }

  getOuterRadius (trackProgress) {
    const start = this.outerRadius.interval.start
    const duration = this.outerRadius.interval.duration
    const progress = Math.min((trackProgress - start) / duration)
    
    return interpolateNumber(this.outerRadius.last, this.outerRadius.next)(easing(progress))
  }

  getInnerRadius (trackProgress) {
    const start = this.innerRadius.interval.start
    const duration = this.innerRadius.interval.duration
    const progress = Math.min((trackProgress - start) / duration)
    
    return interpolateNumber(this.innerRadius.last, this.innerRadius.next)(easing(progress))
  }

  getColor (trackProgress) {
    const start = this.color.interval.start
    const duration = this.color.interval.duration
    const progress = Math.min((trackProgress - start) / duration)

    return interpolateRGB(this.color.last, this.color.next)(easing(progress))
  }

  draw ({ ctx, trackProgress }) {
    const outer = this.getOuterRadius(trackProgress)
    const inner = this.getInnerRadius(trackProgress)
    const color = this.getColor(trackProgress)
    const rotation = trackProgress / 50
    const star = createStar(this.points, inner, outer, this.x, this.y, rotation)
    
    ctx.fillStyle = color
    createPath(ctx, star).fill()
  }
}