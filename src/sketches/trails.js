import Visualizer from '../util/visualizer'
import { growingLine, polygon } from '../util/canvas'
import { interpolateBasis, interpolateRgbBasis } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import ease from '../util/easing'
import {
  TRAILS_SET_ROTATION_CONSTANT, 
  TRAILS_SET_SIDES, 
  TRAILS_SET_TRAIL_LENGTH,
  TRAILS_SET_WIDTH_CONSTANT,
  TRAILS_SET_GLOW_WIDTH,
  TRAILS_SET_SMEAR,
  TRAILS_SET_ROTATION_MULTIPLIER
} from '../vuex/mutation-types'
import { TRAILS } from '../enums'

export default class Trails extends Visualizer {
  constructor (args) {
    super(Object.assign({ 
      hidpi: true, 
      parent: null, 
      fixed: false,
      volumeSmoothing: 30,
      name: 'trails'
    }, args))

    
    this.SIDES = this.sync.$store.state.visualizers.trails.SIDES.VALUE
    this.TRAIL_LENGTH = this.sync.$store.state.visualizers.trails.TRAIL_LENGTH.VALUE
    this.ROTATION_CONSTANT = this.sync.$store.state.visualizers.trails.ROTATION_CONSTANT.VALUE
    this.ROTATION_MULTIPLIER = this.sync.$store.state.visualizers.trails.ROTATION_MULTIPLIER.VALUE
    this.BEAT_AMPLITUDE_CONSTANT = 5
    this.GLOW_WIDTH = this.sync.$store.state.visualizers.trails.GLOW_WIDTH.VALUE

    const setRadius = () => {
      const side = Math.min(window.innerHeight, window.innerWidth)
      this.OUTER_RADIUS = side/2
      this.INNER_RADIUS = side/4
    }

    setRadius()

    this.WIDTH_CONSTANT = this.sync.$store.state.visualizers.trails.WIDTH_CONSTANT.VALUE
    this.FILL = `rgba(12, 8, 50, ${this.sync.$store.state.visualizers.trails.SMEAR.VALUE})`
    this.THEME = ['#FF61E0', '#61E3FF', '#FF61E0']

    this.sync.registerQueue({
      name: 'trails-volume',
      totalSamples: 200,
      smoothing: 20
    })

    this.sync.registerQueue({
      name: 'trails-beat',
      totalSamples: 10,
      smoothing: 1
    })

    this.initModel()
    this.subscribe()
    
    window.addEventListener('resize', setRadius)
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

  subscribe () {
    this.sync.$store.subscribe(({ type, payload }) => {
      switch (type) {
        case TRAILS_SET_SIDES:
          this.SIDES = payload
          this.initModel()
          break
        case TRAILS_SET_TRAIL_LENGTH:
          this.TRAIL_LENGTH = payload
          this.initModel()
          break
        case TRAILS_SET_ROTATION_CONSTANT:
          this.ROTATION_CONSTANT = payload
          break
        case TRAILS_SET_ROTATION_MULTIPLIER:
          this.ROTATION_MULTIPLIER = payload
          break
        case TRAILS_SET_WIDTH_CONSTANT:
          this.WIDTH_CONSTANT = payload
          break
        case TRAILS_SET_GLOW_WIDTH:
          this.GLOW_WIDTH = payload
          break
        case TRAILS_SET_SMEAR:
          this.FILL = `rgba(12, 8, 50, ${scaleLinear([0, 1], [1, 0])(payload)})`
          break
        default:
          return
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
    const finalRadius = (volume + beat)
    const _rotation = interpolateBasis([this.ROTATION_CONSTANT, this.ROTATION_CONSTANT * this.ROTATION_MULTIPLIER, this.ROTATION_CONSTANT])(ease(this.sync.bar.progress, 'easeInOutQuint'))
    const vertices = polygon(this.SIDES, finalRadius, width/2, height/2, now/_rotation*rotation)
    this.updateModel(vertices, name)
    for (let i = this[name].length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this[name][i], (smallest*this.WIDTH_CONSTANT) * this.sync.getVolumeQueue('trails-volume'))
    }
  }

  applyOffscreen ({ ctx, offscreen, width, height }) {
    ctx.save()
    ctx.shadowBlur = this.GLOW_WIDTH * this.sync.getVolumeQueue('trails-volume')
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
    this.group(args, { radius: this.INNER_RADIUS, name: '_03', rotation:  1, multi1: 2, multi2: 2 })
    this.group(args, { radius: this.INNER_RADIUS, name: '_04', rotation: -1, multi1: 2, multi2: 2 })
    this.applyOffscreen(args)
  }
} 