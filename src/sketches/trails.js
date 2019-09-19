import Visualizer from '../util/visualizer'
import { growingLine, polygon } from '../util/canvas'
import { interpolateBasis, interpolateObject } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import ease from '../util/easing'
import {
  TRAILS_SET_ROTATION_CONSTANT, 
  TRAILS_SET_SIDES, 
  TRAILS_SET_TRAIL_LENGTH,
  TRAILS_SET_WIDTH_CONSTANT,
  TRAILS_SET_GLOW_WIDTH,
  TRAILS_SET_SMEAR,
  TRAILS_SET_ROTATION_MULTIPLIER,
  TRAILS_SET_BACKGROUND_COLOR,
  TRAILS_SET_GLOW_COLOR
} from '../vuex/mutation-types'
import { getRandomElement } from '../util/array'

export default class Trails extends Visualizer {
  constructor (args) {
    super(Object.assign({ name: 'trails' }, args))

    const $store = this.sync.$store.state.visualizers.trails
    
    this.SIDES = $store.SIDES.VALUE
    this.TRAIL_LENGTH = $store.TRAIL_LENGTH.VALUE
    this.ROTATION_CONSTANT = $store.ROTATION_CONSTANT.VALUE
    this.ROTATION_MULTIPLIER = $store.ROTATION_MULTIPLIER.VALUE
    this.BEAT_AMPLITUDE_CONSTANT = .6
    this.GLOW_WIDTH = $store.GLOW_WIDTH.VALUE
    this.WIDTH_CONSTANT = $store.WIDTH_CONSTANT.VALUE
    this.BACKGROUND_COLOR = $store.BACKGROUND_COLOR.VALUE
    this.FILL = this.setFill($store.SMEAR.VALUE)
    this.GLOW_COLOR = $store.GLOW_COLOR.VALUE

    this.sync.registerQueue({
      name: 'trails-volume',
      totalSamples: 90,
      smoothing: 5
    })

    this.sync.registerQueue({
      name: 'trails-glow',
      totalSamples: 120,
      smoothing: 20
    })

    this.THEMES = [
      {
        id: 0,
        background: {r: 50, g: 0, b: 72, a: 1},
        glow: {r: 237, g: 107, b: 87, a: 1}
      },
      {
        id: 1,
        background: {r: 1, g: 0, b: 67, a: 1},
        glow: {r: 87, g: 188, b: 237, a: 1}
      },
      {
        id: 2,
        background: {r: 0, g: 1, b: 39, a: 1},
        glow: {r: 74, g: 228, b: 61, a: 1}
      }
    ]

    this.theme = {
      last: {...this.THEMES[0]},
      next: {...this.THEMES[1]}
    }

    const setRadius = () => {
      const side = Math.min(window.innerHeight, window.innerWidth)
      this.RADIUS = side/5
    }

    setRadius()
    window.addEventListener('resize', setRadius)

    this.initModel()
    this.subscribe()
  }

  setFill (value = this.sync.$store.state.visualizers.trails.SMEAR.VALUE) {
    return `rgba(${this.BACKGROUND_COLOR.rgba.r}, ${this.BACKGROUND_COLOR.rgba.g}, ${this.BACKGROUND_COLOR.rgba.b}, ${scaleLinear([0, 1], [1, 0])(value)})`
  }

  get glowColor () {
    return `rgb(${this.GLOW_COLOR.rgba.r}, ${this.GLOW_COLOR.rgba.g}, ${this.GLOW_COLOR.rgba.b})`
  }

  get volume () {
    return this.sync.getVolumeQueue('trails-volume')
  }

  get glow () {
    return this.sync.getVolumeQueue('trails-glow')
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
        case TRAILS_SET_BACKGROUND_COLOR:
          this.BACKGROUND_COLOR = payload
          this.FILL = this.setFill()
          break
        case TRAILS_SET_GLOW_COLOR:
          this.GLOW_COLOR = payload
          break
        case TRAILS_SET_SMEAR:
          this.FILL = this.setFill(payload)
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
      ctx.fillStyle = this.glowColor
      growingLine(ctx, vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y, _width, _next)
      ctx.fill()
    }
  }

  updateColors () {
    this.BACKGROUND_COLOR.rgba = interpolateObject({...this.theme.last.background}, {...this.theme.next.background})(ease(this.sync.bar.progress, 'easeOutCubic'))
    this.GLOW_COLOR.rgba = interpolateObject({...this.theme.last.glow}, {...this.theme.next.glow})(ease(this.sync.bar.progress, 'easeOutCubic'))
    this.FILL = this.setFill()
  }

  clear ({ offscreen, width, height }) {
    this.sketch.fill = this.FILL
    offscreen.clearRect(0, 0, width, height)
  }

  hooks () {
    this.sync.on('bar', () => {
      this.theme.last = {...this.theme.next}
      this.theme.next = {...getRandomElement(this.THEMES.filter(theme => theme.id !== this.theme.last.id))}
    })
  }

  group ({ offscreen, width, height, now, smallest }, { radius, name, rotation, multiplier }) {
    const volume = (radius * Math.pow(this.volume, multiplier)) 
    const beat = volume/(this.BEAT_AMPLITUDE_CONSTANT)
    const finalRadius = volume + beat
    const _rotation = interpolateBasis([this.ROTATION_CONSTANT, this.ROTATION_CONSTANT * this.ROTATION_MULTIPLIER, this.ROTATION_CONSTANT])(ease(this.sync.bar.progress, 'easeInOutQuint'))
    const vertices = polygon(this.SIDES, finalRadius, width/2, height/2, now/_rotation*rotation)
    this.updateModel(vertices, name)
    for (let i = this[name].length - 1; i >= 0; i--) {
      this.drawLine(offscreen, this[name][i], (smallest*this.WIDTH_CONSTANT) * this.glow)
    }
  }

  applyOffscreen ({ ctx, offscreen, width, height }) {
    ctx.save()
    ctx.shadowBlur = this.GLOW_WIDTH 
    ctx.shadowColor = this.glowColor
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(offscreen.canvas, 0, 0, width, height)
    ctx.shadowBlur = ctx.shadowBlur * .5
    ctx.drawImage(offscreen.canvas, 0, 0, width, height)
    ctx.restore()
  }

  paint (args) {
    this.updateColors(args)
    this.clear(args)
    this.group(args, { radius: this.RADIUS,   name: '_01', rotation:  1, multiplier: .5 })
    this.group(args, { radius: this.RADIUS,   name: '_02', rotation: -1, multiplier: .5 })
    this.group(args, { radius: this.RADIUS/2, name: '_03', rotation:  1, multiplier:  2 })
    this.group(args, { radius: this.RADIUS/2, name: '_04', rotation: -1, multiplier:  2 })
    this.applyOffscreen(args)
  }
} 