import Visualizer from '../util/visualizer'
import { growingLine, polygon } from '../util/canvas'
import { interpolateBasis, interpolateRgbBasis } from 'd3-interpolate'
import ease from '../util/easing'

export default class Trails extends Visualizer {
  constructor (args) {
    super(Object.assign({ 
      hidpi: true, 
      parent: null, 
      fixed: false,
      volumeSmoothing: 30,
      name: 'trails'
    }, args))

    this.SIDES = 6
    this.TRAIL_LENGTH = 20
    this.ROTATION_CONSTANT = 12
    this.BEAT_AMPLITUDE_CONSTANT = 2
    this.SHADOW_BLUR_SIZE = 40
    this.OUTER_RADIUS = 300
    this.INNER_RADIUS = 100
    this.WIDTH_CONSTANT = 30
    this.FILL = 'rgba(12, 8, 50, .4)'
    this.THEME = ['#FF61E0', '#61E3FF', '#FF61E0']

    this.sync.registerQueue({
      name: 'trails-volume',
      totalSamples: 70,
      smoothing: 30
    })

    this.sync.registerQueue({
      name: 'trails-beat',
      totalSamples: 10,
      smoothing: 1
    })

    this.initModel()
  }

  initModel () {
    this.buckets = ['_01', '_02', '_03', '_04']

    this.buckets.forEach(bucket => {
      this[bucket] = []
      for (let i = 0; i < this.SIDES; i++) {
        this[bucket].push([])
      }
    })
  }

  updateModel (vertices, group) {
    vertices.forEach(({ x, y }, i) => {
      this[group][i].push({ x, y })
      if (this[group][i].length > this.TRAIL_LENGTH) {
        this[group][i].shift()
      }
    })
  }

  drawLine (ctx, vertices, width) {
    for (let i = 0; i < vertices.length - 1; i++) {
      const percent = (i/(vertices.length-1))
      const next = (i+1)/(vertices.length-1)
      const _width = interpolateBasis([0, width, 0])(percent)
      const _next = interpolateBasis([0, width, 0])(next)
      ctx.fillStyle = interpolateRgbBasis(this.THEME)(percent)
      growingLine(ctx, vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y, _width, _next)
      ctx.fill()
    }
  }

  clear ({ offscreen, width, height }) {
    this.sketch.fill = this.FILL
    offscreen.clearRect(0, 0, width, height)
  }

  group ({ offscreen, width, height, now, smallest }, { radius, name, rotation, multi1, multi2 }) {
    const volume = (radius * Math.pow(this.sync.getVolumeQueue('trails-volume'), multi1))
    const beat = volume/this.BEAT_AMPLITUDE_CONSTANT * Math.pow(this.sync.getVolumeQueue('trails-beat'), multi2) 
    const finalRadius = volume + beat
    const vertices = polygon(this.SIDES, finalRadius, width/2, height/2, now/this.ROTATION_CONSTANT*rotation)
    this.updateModel(vertices, name)
    for (let i = this[name].length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this[name][i], (smallest/this.WIDTH_CONSTANT) * this.sync.getVolumeQueue('trails-volume'))
    }
  }

  applyOffscreen ({ ctx, offscreen, width, height }) {
    ctx.save()
    ctx.shadowBlur = this.SHADOW_BLUR_SIZE * this.sync.getVolumeQueue('trails-volume')
    ctx.shadowColor = interpolateRgbBasis(this.THEME)(ease(this.sync.bar.progress, 'linear'))
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(offscreen.canvas, 0, 0, width, height)
    ctx.shadowBlur = ctx.shadowBlur / 2
    ctx.shadowColor = interpolateRgbBasis(this.THEME)(ease(this.sync.beat.progress, 'linear'))
    ctx.drawImage(offscreen.canvas, 0, 0, width, height)
    ctx.restore()
  }

  paint (args) {
    this.clear(args)
    this.group(args, { radius: this.OUTER_RADIUS, name: '_01', rotation:  1, multi1: 2, multi2: 1 })
    this.group(args, { radius: this.OUTER_RADIUS, name: '_02', rotation: -1, multi1: 2, multi2: 1 })
    this.group(args, { radius: this.INNER_RADIUS, name: '_03', rotation:  1, multi1: 1, multi2: 1 })
    this.group(args, { radius: this.INNER_RADIUS, name: '_04', rotation: -1, multi1: 1, multi2: 1 })
    this.applyOffscreen(args)
  }
} 