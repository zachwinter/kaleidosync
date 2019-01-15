import { interpolateNumber, interpolateRGB } from '../util/interpolate'
import easing from '../util/easing'

const PI = Math.PI
const ROTATION = PI/2*3

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
    this.step = PI/this.points
    
    this.color = {
      active: color,
      last: color,
      next: color,
      interval: {}
    }

    this.innerRadius = {
      active: innerRadius,
      last: innerRadius,
      next: innerRadius,
      interval: {}
    }

    this.outerRadius = {
      active: outerRadius,
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
      this.step = PI/this.points
    }
  }

  draw ({ ctx, trackProgress }) {
    const outerRadiusProgress = easing( Math.min((trackProgress - this.outerRadius.interval.start) / this.outerRadius.interval.duration, 1) )
    const innerRadiusProgress = easing( Math.min((trackProgress - this.innerRadius.interval.start) / this.innerRadius.interval.duration, 1) )
		const colorProgress = easing( Math.min((trackProgress - this.color.interval.start) / this.color.interval.duration, 1) )
		
    this.outerRadius.active = interpolateNumber(this.outerRadius.last, this.outerRadius.next)(outerRadiusProgress)
    this.innerRadius.active = interpolateNumber(this.innerRadius.last, this.innerRadius.next)(innerRadiusProgress)
    this.color.active = interpolateRGB(this.color.last, this.color.next)(colorProgress)

    let rotation = ROTATION
    let x = this.x
    let y = this.y

    ctx.beginPath(this.points) 
    ctx.moveTo(this.x, this.y - this.outerRadius.active)

    for (var i = 0; i < this.points; i++) {
      x = this.x + Math.cos(rotation) * this.outerRadius.active
      y = this.y + Math.sin(rotation) * this.outerRadius.active
      ctx.lineTo(x, y)
      rotation += this.step
      x = this.x + Math.cos(rotation) * this.innerRadius.active
      y = this.y + Math.sin(rotation) * this.innerRadius.active
      ctx.lineTo(x, y)
      rotation += this.step
    }
    
    ctx.lineTo(this.x, this.y - this.outerRadius.active)
    ctx.closePath()
    ctx.fillStyle = this.color.active
    ctx.fill()
  }
}