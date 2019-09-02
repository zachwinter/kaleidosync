import Visualizer from '../util/visualizer'
import { growingLine, polygon } from '../util/canvas'
import { interpolateBasis, interpolateRgbBasis } from 'd3-interpolate'
import ease from '../util/easing'

export default class Trails extends Visualizer {
  constructor ({ parent = null, fixed = false, volumeSmoothing = 30 } = {}) {
    super({
      volumeSmoothing, 
      hidpi: true, 
      parent, 
      fixed,
      name: 'trails'
    })

    this.SIDES = 9
    this.TRAIL_LENGTH = 30

    this._01 = []
    this._02 = []
    this._03 = []

    for (let i = 0; i < this.SIDES; i++) {
      this._01.push([])
      this._02.push([])
      this._03.push([])
    }
    
    this.theme = ['#FF4242', '#18FF2A', '#7718FF', '#FF4242']
    this.iTheme = interpolateRgbBasis(this.theme)
    this.beat = interpolateBasis([-100, 100, -100])
    this.bar = interpolateBasis([-500, 500, -500])
    // this.sketch.ctx.lineCap = 'round'
  }

  drawLine (ctx, vertices, width) {
    for (let i = 0; i < vertices.length - 1; i++) {
      const percent = (i/(vertices.length-1))
      const next = (i+1)/(vertices.length-1)
      const _width = interpolateBasis([0, width, 0])(percent)
      const _next = interpolateBasis([0, width, 0])(next)
      ctx.fillStyle = this.iTheme(percent)
      growingLine(ctx, vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y, _width, _next)
      ctx.fill()
    }
  }

  update (vertices, group) {
    vertices.forEach(({ x, y }, i) => {
      this[group][i].push({ x, y })
      if (this[group][i].length > this.TRAIL_LENGTH) {
        this[group][i].shift()
      }
    })
  }

  paint01 ({ ctx, width, height, now, smallest }) {
    const progress = (ease(this.sync.bar.progress, 'easeInOutQuint'))
    const bar = interpolateBasis([-(smallest*(5/8)), (smallest*(5/8)), -(smallest*(5/8))])(progress) * this.sync.volume
    const radius = (Math.pow(this.sync.volume, 2) * (smallest / 2)) + bar
    const vertices = polygon(this.SIDES, radius, width/2, height/2, now/20)
    this.update(vertices, '_01')
    for (let i = this._01.length - 1; i >= 0; i--) {
      this.drawLine(ctx, this._01[i], (smallest/50) * this.sync.volume)
    }
  }

  paint02 ({ ctx, width, height, now, smallest }) {
    const beat = interpolateBasis([-smallest/8, smallest/8, -smallest/8])(ease(this.sync.beat.progress, 'easeOutQuint'))
    const radius = Math.pow(this.sync.volume, 2) * smallest / 3 + beat
    const vertices = polygon(Math.round(this.SIDES/2), radius, width/2, height/2, now/-10)
    this.update(vertices, '_02')
    for (let i = this._02.length - 1; i >= 0; i--) {
      this.drawLine(ctx, this._02[i], (smallest/32) * this.sync.volume)
    }
  }

  paint03 ({ ctx, width, height, now, smallest }) {
    const beat = interpolateBasis([-smallest/8, smallest/8, -smallest/8])(ease(this.sync.beat.progress, 'easeOutQuint'))
    const radius =  Math.pow(this.sync.volume, 2) * smallest / 4 + beat
    const vertices = polygon(this.SIDES, radius, width/2, height/2, now/15)
    this.update(vertices, '_03')
    for (let i = this._03.length - 1; i >= 0; i--) {
      this.drawLine(ctx, this._03[i], (smallest/50) * this.sync.volume)
    }
  }

  paint (args) {
    this.sketch.fill = 'rgba(0, 0, 0, 1)'
    const beat = this.beat()
    this.paint01(args)
    this.paint02(args, beat)
    this.paint03(args, beat)
  }
} 