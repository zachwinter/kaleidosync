import Visualizer from '@/util/visualizer'
import { getRandomElement } from '../util/array'
import Observe from '../util/observe'
import { createStar, drawShape } from '../util/canvas'
import { interpolate, interpolateBasis } from 'd3-interpolate'
import ease from '../util/easing'

export default class Kaleidosync extends Visualizer {
  constructor (args) {
    super(Object.assign({ name: 'kaleidosync' }, args))

    this.state = Observe({
      easing: 'easeOutQuint',  
      totalStars: 32,
      minSize: 0,
      maxSize: 0,
      activeSize: 0,
      radiusStep: [.1, .2, .3, .4, .5, .8, 1, 1.1, 1.2, 1.3],
      sizeStep: [],
      colorThemes: [
        [[255,255,255], [255,191,105], [255,159,28], [203,243,240], [46,196,182]],
        [[229,99,153], [210,241,228], [251,202,239], [72,48,77], [255,255,255]],
        [[198,0,66], [255,119,168], [226,206,239], [255,198,217], [255,255,255]],
        [[118,229,252], [27,154,170], [157,172,255], [61,52,139], [238,251,255]],
        [[10,36,99], [62,146,204], [255,250,255], [216,49,91], [39,27,24]]
      ],
      activeColorTheme: {},
      negativeSpace: 20,
      stars: [],
      background: {} 
    })

    this.sync.registerQueue({
      name: 'kaleidosync-beat',
      totalSamples: 240,
      smoothing: 30
    })

    this.setSizeParams()
    this.setInitialModel()

    window.addEventListener('resize', () => {
      this.setSizeParams()
    })
  }

  setSizeParams () {
    const landscape = this.sketch.height < this.sketch.width
  
    if (landscape) {
      this.state.maxSize = this.sketch.width / 2
    } else {
      this.state.maxSize = this.sketch.height / 2
    }
  
    this.state.minSize = this.state.maxSize / 10
    this.state.activeSize = this.state.maxSize
  
    const { maxSize, totalStars } = this.state
    this.state.sizeStep = [...this.state.radiusStep].map(val => (maxSize/totalStars) * val)
  }

  setInitialModel () {
    if (this.sync.state.initialized === true) return
  
    this.setColorTheme()
  
    let size = this.state.activeSize
  
    for (var i = 0; i < this.state.totalStars; i++) {
      let points = 8
  
      if ((i + 1) % 2 === 0) { points = 16 }
      if ((i + 1) % 3 === 0) { points = 24 }
      
      size = ~~(size - getRandomElement(this.state.sizeStep))
  
      if (size < this.state.minSize ) {
        size = this.state.minSize
      }
  
      const color = (i === this.state.totalStars - 1)
        ? this.state.activeColorTheme.negative
        : getRandomElement(this.state.activeColorTheme.theme)
  
      this.addStar({ points, color, size })
    }
  
    this.state.background = {
      last: this.state.activeColorTheme.negative,
      next: this.state.activeColorTheme.negative,
      interval: {},
      get: () => this.state.activeColorTheme.negative 
    }
  }

  setColorTheme () {
    const theme = [...getRandomElement(this.state.colorThemes)]
    const negative = getRandomElement(theme)
    const others = theme.filter(t => t !== negative)
    const primary = getRandomElement(others)
    
    let i = 0

    while (i < this.state.negativeSpace) {
      theme.push(negative)
      i++
    }

    this.state.activeColorTheme = {
      theme,
      negative,
      primary
    }
  }

  addStar ({ points, color, size }) {
    const x = this.sketch.width/2
    const y = this.sketch.height/2
    const outerRadius = size
    const innerRadius = size * getRandomElement(this.state.radiusStep)
    const startVolume = 0

    const star = {
      x,
      y,
      points,
      outerRadius: {
        last: outerRadius,
        next: outerRadius,
        interval: {},
        get () { return outerRadius }
      },
      innerRadius: {
        last: innerRadius,
        next: innerRadius,
        interval: {},
        get () { return innerRadius }
      },
      color: {
        last: color,
        next: color,
        interval: {},
        get () { return color }
      },
      startVolume: {
        last: startVolume,
        next: startVolume,
        interval: {},
        get () { return startVolume }
      },
      lineWidth: {
        last: 0,
        next: 0,
        interval: {},
        get () { return 0 }
      }
    }
  
    this.state.stars.push(star)
  }

  setStarRadius (type) {
    const nextSegment = this.sync.state.trackAnalysis.segments[this.sync.segment.index + 1]

    let size 

    if (nextSegment) {
      size = this.state.activeSize * this.sync.getVolumeQueue('kaleidosync-beat') //this.sync.getFutureVolume(this.sync.segment.index + 1)
    } else {
      size = this.state.activeSize * this.sync.getVolumeQueue('kaleidosync-beat')
    }

    this.state.stars.forEach((star, index) => {
      size = ~~(size - getRandomElement(this.state.sizeStep))
      
      if (size < this.state.minSize ) {
        size = this.state.minSize
      } 
  
      const innerRadius = {
        val: index === this.state.stars.length - 1
          ? size * .8
          : size * getRandomElement(this.state.radiusStep),
        interval: type
      }
  
      const outerRadius = {
        val: size,
        interval: type
      }
  
      this.updateStar({
        innerRadius,
        outerRadius,
        index
      })
    })
  }

  setStarColor (type) {
    this.state.stars.forEach((star, index) => {
      const color = (index === this.state.totalStars - 1)
        ? this.state.activeColorTheme.negative
        : getRandomElement(this.state.activeColorTheme.theme)

      this.updateStar({
        color: {
          val: color,
          interval: type
        },
        index
      })
    })
  }

  updateStar ({
    index,
    innerRadius = null,
    outerRadius = null,
    color = null,
    points = null
  }) {
    const star = this.state.stars[index]
  
    const update = (key, { val, interval }) => {
      star[key].last = star[key].next
      star[key].next = val
      star[key].interval = interval
      star[key].get = () => interpolate(star[key].last, star[key].next)(ease(this.sync[interval].progress, this.state.easing, true))
    }
  
    if (color !== null) {
      update('color', color)
    }
  
    if (innerRadius !== null) {
      update('innerRadius', innerRadius)
    }
  
    if (outerRadius !== null) {
      update('outerRadius', outerRadius)
    }

    if (points !== null) {
      star.points = points
    }
  }

  setBackgroundColor (type) {
    const val = [...this.state.activeColorTheme.negative]
    this.state.background.last = [...this.state.background.next]
    this.state.background.next = val
    this.state.background.get = () => {
      return interpolate(this.state.background.last, this.state.background.next)(this.sync[type].progress)
    }
  }

  hooks () {
    this.sync.on('tatum', () => {
      this.setStarRadius('tatum')
    })

    this.sync.on('beat', () => {
      this.setStarColor('beat')
      this.setBackgroundColor('beat')
    })

    this.sync.on('bar', ({ index }) => {
      if (index % 4 === 0) {
        this.setColorTheme()
      }
    })
  }

  paint ({ ctx, height, width, now }) {
    const [r, g, b] = this.state.background.get()
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fillRect(0, 0, width, height)
    
    // const volume = this.sync.getVolumeQueue('kaleidosync-beat')
    const beat = interpolateBasis([1, 1.2, 1])(ease(this.sync.beat.progress, 'easeOutCubic'))// * this.sync.getVolumeQueue('kaleidosync-beat')

    for (let star of this.state.stars) {
      const inner = star.innerRadius.get() * beat
      const outer = star.outerRadius.get() * beat
      const rotation = now / 40
      const { vertices } = createStar(star.points, inner, outer, width/2, height/2, rotation)
      const [r, g, b] = star.color.get()
      ctx.fillStyle = `rgb(${r},${g},${b})`
      drawShape(ctx, vertices).fill()
    }
  }
}