import Visualizer from './visualizer'
import Canvas from './canvas'
import Star from './star'
import Rectangle from './rectangle'
import Colors from './colors'

Array.prototype.randomElement = function() {
  return this[Math.floor(Math.random() * this.length)]
}

class Kaleidoscope extends Visualizer {
  constructor(halt) {
    super(halt)
        
    this.halt = halt
    this.canvas = new Canvas('kaleidoscope')
    this.totalStars = 16 
    this.maxSize = (this.canvas.isMobile ? 1.2 : .5) * (window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth)
    this.minSize = this.maxSize / 5
    this.activeSize = this.halt ? this.maxSize : this.minSize
    this.sizeStep = [
      ((this.maxSize / this.totalStars) * 0.4),
      ((this.maxSize / this.totalStars) * 0.6),
      ((this.maxSize / this.totalStars) * 0.8)
    ]
    this.radiusStep = [.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2]
    this.colorSchemes = Colors
    this.activeColorScheme = []
    this.duration = 5000 
    this.radiusDuration = this.duration
    this.colorDuration = this.duration
    this.backgroundDuration = this.duration
    this.refreshRate = 1000/60
    this.model = {
      stars: { last: [],
        active: []
      },
      background: {
        last: {},
        active: {}
      }
    }

    this.setEventHooks()

    if (this.halt === true) {
      this.buildSingleState(true)
    } else {
      this.pingSpotify(true)
    } 
  }

  setEventHooks() {
    this.events.beforeInit = () => {
      this.setActiveColorScheme()
      this.initElements()
    }

    this.events.beforeStart = () => {
      this.canvas.startPaint()
    }

    this.events.afterStop = () => {
      this.clearTweeningIntervals()
      this.canvas.stopPaint()
    }
  }

  buildSingleState(init) {
    this.activeSize = this.maxSize

    if (init) {
      this.initElements()
    } 

    this.setActiveColorScheme()
    this.setColorState()
    this.setRadiusState()

    if (!init) {
      this.tweenStarRadius()
      this.tweenStarColor() 
      this.tweenBackgroundColor()
    }

    if (init) { 
      this.buildSingleState()

      setTimeout(() => {
        this.clearTweeningIntervals()
        this.canvas.stopPaint()
      }, this.duration)
    }
  }

  initElements() {
    if (this.initialized === true) {
      return
    }

    for (var i = 0; i < this.totalStars; i++) {
      let numPoints = 16

      if ((i + 1) % 2 === 0) { numPoints = 24 }
      if ((i + 1) % 3 === 0) { numPoints = 8  }
      if ((i + 1) % 4 === 0) { numPoints = 32 }

      let starState = {
        x: this.canvas.width/2,
        y: this.canvas.height/2,
        points: numPoints,
        color: 'rgb(255,255,255)',
        innerRadius: 0,
        outerRadius: 0
      }

      let star = new Star(starState)

      this.model.stars.active[i] = starState
      this.model.stars.last[i] = starState
      this.canvas.addStar(star)
    }

    let backgroundState = {
      color: 'rgb(255,255,255)',
      width: this.canvas.width,
      height: this.canvas.height
    }

    this.model.background.active = backgroundState
    this.model.background.last = backgroundState
    this.canvas.addBackground(new Rectangle(backgroundState))
    this.canvas.init()
    this.initialized = true
  }

  setRadiusState() {
    let size = this.activeSize

    for (var i = 0; i < this.totalStars; i++) {
      size = parseInt(size - this.sizeStep.randomElement())

      if (size < this.minSize ) {
        size = this.minSize
      } 

      clearInterval(this.canvas.stars[i].radiusTween)

      this.model.stars.last[i].innerRadius = this.model.stars.active[i].innerRadius
      this.model.stars.last[i].outerRadius = this.model.stars.active[i].outerRadius
      this.model.stars.active[i].innerRadius = size * this.radiusStep.randomElement()
      this.model.stars.active[i].outerRadius = size
    }
  }

  setColorState() { 
    for (var i = 0; i < this.totalStars; i++) {
      clearInterval(this.canvas.stars[i].colorTween)

      this.model.stars.last[i] = {
        ...this.model.stars.last[i],
        color: this.model.stars.active[i].color
      }

      this.model.stars.active[i].color = this.activeColorScheme.randomElement()
    }
  }

  setBackgroundState(negative) {
    clearInterval(this.canvas.background.colorTween)

    this.model.background.last = {
      ...this.model.background.last,
      color: this.model.background.active.color
    }

    this.model.background.active = {
      ...this.model.background.active, 
      color: negative
    }
  }

  tweenStarRadius(ms) {
    let duration = ms ? ms : this.radiusDuration

    for (let i = 0; i < this.totalStars; i++) {
      let star = this.canvas.stars[i]
      let next = this.model.stars.active[i]
      let last = this.model.stars.last[i]
      let innerStep = (next.innerRadius - last.innerRadius) / (duration / this.refreshRate)
      let outerStep = (next.outerRadius - last.outerRadius) / (duration / this.refreshRate)
      let innerTween = last.innerRadius
      let outerTween = last.outerRadius

      star.radiusTween = setInterval(() => {
        innerTween = innerTween + innerStep
        outerTween = outerTween + outerStep

        next.innerRadius = innerTween
        next.outerRadius = outerTween

        if (!isNaN(innerTween)) {
          star.update({
            innerRadius: innerTween,
            outerRadius: outerTween
          })
        } else {
          clearInterval(star.radiusTween)
        }
      }, this.refreshRate)
    }
  }

  tweenRGB(duration, next, last, element, setColor) {
    let stepR = (parseInt(next[0]) - parseInt(last[0])) / (duration / this.refreshRate)
    let stepG = (parseInt(next[1]) - parseInt(last[1])) / (duration / this.refreshRate)
    let stepB = (parseInt(next[2]) - parseInt(last[2])) / (duration / this.refreshRate)
    
    let tweenR = parseInt(last[0])
    let tweenG = parseInt(last[1])
    let tweenB = parseInt(last[2])

    element.colorTween = setInterval(() => {
      tweenR = parseInt(tweenR + stepR)
      tweenG = parseInt(tweenG + stepG)
      tweenB = parseInt(tweenB + stepB)

      setColor(`rgb(${tweenR}, ${tweenG}, ${tweenB})`)
    }, this.refreshRate)
  }

  tweenStarColor(ms) {
    let duration = ms ? ms : this.colorDuration

    for (let i = 0; i < this.totalStars; i++) {
      let next = this.model.stars.active[i].color.slice(4, -1).split(',')
      let last = this.model.stars.last[i].color.slice(4, -1).split(',')
      
      this.tweenRGB(duration, next, last, this.canvas.stars[i], (color) => {
        this.model.stars.active[i].color = color
        this.canvas.stars[i].update({ color })
      })
    }
  }

  tweenBackgroundColor(ms) {
    let duration = ms ? ms : this.backgroundDuration
    let next = this.model.background.active.color.slice(4, -1).split(',')
    let last = this.model.background.last.color.slice(4, -1).split(',')

    this.tweenRGB(duration, next, last, this.canvas.background, (color) => {
      this.model.background.active.color = color 
      this.canvas.background.update({ color })
    })
  }

  setActiveColorScheme() {
    let colors = this.colorSchemes.randomElement()
    let negative = colors.randomElement()
    let negArray = [negative, negative, negative, negative]

    this.activeColorScheme = colors.concat(negArray)
    this.setBackgroundState(negative)
  }

  clearTweeningIntervals() {
    if (this.initialized) {
      for (var i = 0; i < this.totalStars; i++) {
        clearInterval(this.canvas.stars[i].radiusTween)
        clearInterval(this.canvas.stars[i].colorTween)
      }

      clearInterval(this.canvas.background.colorTween)
    }
  }
  
  setIntervalHooks() {
    this.intervals.hooks.tatums = () => {
      this.radiusDuration = this.intervals.active.tatums.duration * 1000
      this.setRadiusState()  
      this.tweenStarRadius() 
    }

    this.intervals.hooks.segments = () => {
      const nextLoudness = this.intervals.next.segments ? this.intervals.next.segments.loudness_max : this.intervals.active.segments.loudness_max
      const lastLoudness = this.intervals.last.segments ? this.intervals.last.segments.loudness_max : this.intervals.active.segments.loudness_max
      const activeLoudness = (this.intervals.active.segments.loudness_max + nextLoudness + lastLoudness)/3

      this.activeSize = (this.maxSize - (activeLoudness * -25)) + (this.trackFeatures.loudness * -10)
    }

    this.intervals.hooks.beats = () => {  
      this.colorDuration = this.intervals.active.beats.duration * 1000
      this.setColorState() 
      this.tweenStarColor()
    }

    this.intervals.hooks.bars = () => {
      this.backgroundDuration = this.intervals.active.bars.duration * 1000
      this.setActiveColorScheme()
      this.tweenBackgroundColor()
    }
  } 
}

export default Kaleidoscope