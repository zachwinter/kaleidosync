import Visualizer from '../util/visualizer'
import { interpolateBasis, interpolateNumber } from 'd3-interpolate'
import ease from '../util/easing'
import { color } from 'd3-color'
import { randomNumber } from '../util/numbers'

const TWO_PI = Math.PI * 2
const THEME = [
  color('#FF8360'), // yellow
  color('#00FFF5'), // turqoise
  color('#D84797'), // red
  color('#292F36') // black
]

function getColor (index, alpha = 1) {
  const { r, g, b } = THEME[index]
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

class Blob {
  constructor (interval, self, color) {
    this.self = self
    this.interval = interval
    this.birth = window.performance.now()
    this.lifespan = interval.duration
    this.color = color
    this.width = window.innerWidth/5* Math.pow(self.sync.volume, 2)
  }

  paint ({ ctx, width, height, now }) {
    const WIDTH_DIVIDER = 80
    const BEAT_MULTIPLIER = 80
    const ROTATION_CONSTANT = 2500
    const LIFESPAN_MULTIPLIER = 3
    const SIDES = 5
    const SHADOW_BLUR_MULTIPLIER = 3
    const GRAPH_SLICE = .02
    const EASING = 'easeOutQuart'

    const progress = Math.max(Math.min((now - this.birth) / (this.lifespan * LIFESPAN_MULTIPLIER), 1), 0)
    if (progress === 1) return this.self.blobs = this.self.blobs.filter(c => c !== this)

    const iRadius = interpolateNumber(0,this.width)
    const iLineWidth = interpolateBasis([0, this.width/WIDTH_DIVIDER, 0]) 
    const beat = interpolateBasis([1,BEAT_MULTIPLIER,1])(ease(this.self.sync.beat.progress, EASING))
    const radius = iRadius(progress)
    const amplitude = interpolateBasis([-radius/2, radius, -radius/2])(ease(this.self.sync.beat.progress, EASING))
    const rotation = now/ROTATION_CONSTANT
    
    
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'  
    ctx.beginPath()

    for (let theta = 0; theta <= TWO_PI + GRAPH_SLICE; theta+= GRAPH_SLICE) {
      const _x = (radius + (amplitude * Math.sin(SIDES * (theta - rotation)))) * Math.cos(theta) + width/2
      const _y = (radius + (amplitude * Math.sin(SIDES * (theta + rotation)))) * Math.sin(theta) + height/2
      if (theta === 0) {
        
        ctx.moveTo(_x, _y)
      } else {
        ctx.lineTo(_x, _y)
      }
    }

    ctx.closePath()
    ctx.strokeStyle = this.color
    ctx.lineWidth = iLineWidth(progress) * beat 
    ctx.shadowBlur = ctx.lineWidth * SHADOW_BLUR_MULTIPLIER
    ctx.shadowColor = this.color
    ctx.globalCompositeOperation = 'lighter'
    ctx.stroke()
    ctx.restore()
  }
}

export default class Blobs extends Visualizer {
  constructor ({ parent = null, volumeSmoothing = 80 } = {}) {
    super({ volumeSmoothing, hidpi: true, parent })
    this.blobs = []
  }

  hooks () {
    this.sync.on('tatum', interval => {
      const index = randomNumber(0, 2, true)
      const color = getColor(index)
      const blob = new Blob(interval, this, color)
      this.blobs.push(blob)
    })
  }

  paint ({ width, height, now, ctx }) {
    this.sketch.fill = getColor(3, .8)
    for (let i = this.blobs.length - 1; i >= 0; i--) {
      this.blobs[i].paint({ width, height, now, ctx })
    }
  }
}