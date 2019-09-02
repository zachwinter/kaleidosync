import Visualizer from '../util/visualizer'
import { growingLine, polygon } from '../util/canvas'
import { interpolateBasis, interpolateRgbBasis } from 'd3-interpolate'

export default class Trails extends Visualizer {
  constructor ({ parent = null, fixed = false, volumeSmoothing = 30 } = {}) {
    super({
      volumeSmoothing, 
      hidpi: true, 
      parent, 
      fixed,
      name: 'trails'
    })

    this.sync.registerQueue({
      name: 'volume',
      totalSamples: 70,
      smoothing: 30
    })

    this.sync.registerQueue({
      name: 'beat',
      totalSamples: 10,
      smoothing: 1
    })

    this.SIDES = 6
    this.TRAIL_LENGTH = 25

    this._01 = []
    this._02 = []
    this._03 = []
    this._04 = []

    for (let i = 0; i < this.SIDES; i++) {
      this._01.push([])
      this._02.push([])
      this._03.push([])
      this._04.push([])
    }
    
    this.theme = ['#55FF84', '#A78BFF', '#67E9FF', '#55FF84']
    this.iTheme = interpolateRgbBasis(this.theme)
    this.sketch.ctx.lineCap = 'round'
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

  clear ({ offscreen, width, height }) {
    this.sketch.fill = 'rgba(12,8,50,.25)'
    offscreen.clearRect(0, 0, width, height)
  }

  paint01 ({ offscreen, width, height, now, smallest }) {
    const volume = (300 * Math.pow(this.sync.getVolumeQueue('volume'), 2))
    const beat = volume/5 * Math.pow(this.sync.getVolumeQueue('beat'), 1) 
    const radius = volume + beat
    const vertices = polygon(this.SIDES, radius, width/2, height/2, now/15)
    this.update(vertices, '_01')
    for (let i = this._01.length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this._01[i], (smallest/40) * this.sync.getVolumeQueue('volume'))
    }
  }

  paint02 ({ offscreen, width, height, now, smallest }) {
    const volume = (300 * Math.pow(this.sync.getVolumeQueue('volume'), 2))
    const beat = volume/5 * Math.pow(this.sync.getVolumeQueue('beat'), 1)
    const radius = volume + beat
    const vertices = polygon(Math.round(this.SIDES), radius, width/2, height/2, now/-15)
    this.update(vertices, '_02')
    for (let i = this._02.length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this._02[i], (smallest/30) * this.sync.getVolumeQueue('volume'))
    }
  }

  paint03 ({ offscreen, width, height, now, smallest }) {
    const volume = (100 * Math.pow(this.sync.getVolumeQueue('volume'), 1))
    const beat = volume/5 * Math.pow(this.sync.getVolumeQueue('beat'), 1)
    const radius = volume + beat
    const vertices = polygon(this.SIDES, radius, width/2, height/2, now/-15)
    this.update(vertices, '_03')
    for (let i = this._03.length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this._03[i], (smallest/40) * this.sync.getVolumeQueue('volume'))
    }
  }

  paint04 ({ offscreen, width, height, now, smallest }) {
    const volume = (100 * Math.pow(this.sync.getVolumeQueue('volume'), 1))
    const beat = volume/5 * Math.pow(this.sync.getVolumeQueue('beat'), 1)
    const radius = volume + beat
    const vertices = polygon(this.SIDES, radius, width/2, height/2, now/15)
    this.update(vertices, '_04')
    for (let i = this._03.length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this._04[i], (smallest/30) * this.sync.getVolumeQueue('volume'))
    }
  }

  applyOffscreen({ ctx, offscreen, width, height }) {
    ctx.save()
    // const beat = interpolateBasis([1, 3, 1])(ease(this.sync.beat.progress, 'easeOutQuint'))
    ctx.shadowBlur = 40 * this.sync.getVolumeQueue('volume') //* beat
    ctx.shadowColor = this.iTheme(this.sync.bar.progress)
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(offscreen.canvas, 0, 0, width, height)
    ctx.restore()

    ctx.save()
    ctx.shadowBlur = 20
    ctx.shadowColor = this.iTheme(this.sync.bar.progress)
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(offscreen.canvas, 0, 0, width, height)
    ctx.restore()
  }

  paint (args) {
    this.clear(args)
    this.paint01(args)
    this.paint02(args)
    this.paint03(args)
    this.paint04(args)
    this.applyOffscreen(args)
  }
} 