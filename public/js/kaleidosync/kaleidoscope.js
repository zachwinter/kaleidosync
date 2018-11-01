import SpotifyConnect from './spotify-connect'
import Colors from './elements/colors'
import Star from './elements/star'
import Background from './elements/background'

Array.prototype.randomElement = function() {
  return this[Math.floor(Math.random() * this.length)]
}

class Kaleidoscope extends SpotifyConnect {
  constructor(_static) {
    super()
    
    /**
     * If `_static === true` then the visualizer is rendered with fake static intervals. 
     */
    this.static = _static || false
    this.initCanvas()
    this.setParameters()
    this.setInitialState()

    if (this.static !== true) {
      this.setEventHooks() 
      this.pingSpotify(true)
    } else {
      this.setStaticIntervals()
      console.log('START requestAnimationFrame() – this.staticTween()')
      this.state.raf = requestAnimationFrame(this.staticTween.bind(this))
    }

    window.addEventListener('resize', this.onResize.bind(this))
  }

  /**
   * Set reference to <canvas> element and 2d context. 
   * @param {boolean} reset (optional) – resets <canvas> size without affecting other properties. 
   */
  initCanvas(reset) {
    this.canvas = reset ? this.canvas : document.getElementById('kaleidoscope')
    this.ctx = reset ? this.ctx : this.canvas.getContext('2d')
    this.initialized = reset ? this.initialized : false
    this.drawing = reset ? this.drawing : false
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight 
  }

  /**
   * Resize <canvas> and elements according to new browser window size.
   */
  onResize() {
    this.initCanvas(true)
    this.setSizeRange()

    this.state.active.background.set({
      width: this.canvas.width,
      height: this.canvas.height
    }).draw(this.ctx)
    
    for (var i = 0; i < this.totalStars; i++) {
      this.state.active.stars[i].set({
        x: this.canvas.width/2,
        y: this.canvas.height/2
      }).draw(this.ctx)
    }
  }

  /**
   * Set initial visual parameters.
   */
  setParameters() {
    this.setSizeRange()
    this.setSingleTweenDuration()
    this.activeSize = this.static ? this.maxSize : this.minSize
    this.totalStars = 20
    this.radiusStep = [.3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2]
    this.sizeStep = [
      ((this.maxSize / this.totalStars) * 0.4),
      ((this.maxSize / this.totalStars) * 0.6),
      ((this.maxSize / this.totalStars) * 0.8),
      ((this.maxSize / this.totalStars) * 1.0),
      ((this.maxSize / this.totalStars) * 1.2),
      ((this.maxSize / this.totalStars) * 1.4)
    ]
    this.setState('color-scheme')
  }

  /**
   * Set min and max star size according to current window size.
   */
  setSizeRange() {
    const landscape = window.innerHeight < window.innerWidth

    if (landscape) {
      this.maxSize = window.innerWidth / 2
    } else {
      this.maxSize = window.innerHeight / 2
    }

    this.minSize = this.maxSize / 7
  }

  /**
   * Set state. "Active" state will be the current tween state between "last" and "next."
   */
  setInitialState() {
    console.log('setInitialState()')

    this.state = {}
    this.state.last = this.buildSingleState()
    this.state.active = this.buildSingleState()
    this.state.next = this.buildSingleState()
    this.state.static = 0
    this.initialStart = 0
  }

  /**
   * Build a single visual state.
   * @returns {object} _state – generated visual state.
   */
  buildSingleState() {
    console.log('buildSingleState()')

    const _state = {
      stars: [],
      background: {}
    }

    let size = this.activeSize

    for (var i = 0; i < this.totalStars; i++) {
      let numPoints = 24

      if ((i + 1) % 2 === 0) { numPoints = 18 }
      if ((i + 1) % 3 === 0) { numPoints = 12 }
      if ((i + 1) % 4 === 0) { numPoints = 32 }
      
      size = parseInt(size - this.sizeStep.randomElement())

      if (size < this.minSize ) {
        size = this.minSize
      }

      const star = {
        x: this.canvas.width/2,
        y: this.canvas.height/2,
        points: numPoints,
        color: i === this.totalStars - 1 ? this.colors.negative : this.colors.scheme.randomElement(),
        innerRadius: size * this.radiusStep.randomElement(),
        outerRadius: size
      }
      
      _state.stars.push(new Star(star))
    }

    _state.background = new Background({
      color: this.colors.negative,
      width: this.canvas.width,
      height: this.canvas.height
    })

    return _state
  }

  /**
   * Set state of type at varying interval changes. 
   * @param {string} type – Type of state to set.
   */
  setState(type) {
    const setColors = (colors, negative) => {
      this.colors = {
        original: [...colors]
      }
      let i = 0
      while (i < (Math.random() * 80 - 25) + 25) { 
        colors.push(negative)
        i++
      }
      this.colors.scheme = colors
      this.colors.negative = negative
      document.getElementById('shade').style.background = this.colors.negative
    }

    switch(type) {

      /** Active size of kaleidoscope. */
      case 'size':
        const segment = this.intervals.active.segments
        const last = this.trackAnalysis.segments[segment.index - 1] ? this.trackAnalysis.segments[segment.index - 1].loudness_max : segment.loudness_max
        const next = this.trackAnalysis.segments[segment.index + 1] ? this.trackAnalysis.segments[segment.index + 1].loudness_max : segment.loudness_max
        const active = (segment.loudness_max + last + next)/3
        this.activeSize = (this.maxSize + (active * 25)) + (this.trackFeatures.loudness * -15)
        break

      /** Active color scheme. */
      case 'color-scheme':
        let scheme = Colors.randomElement()
        setColors([...scheme], scheme.randomElement())
        break
        
      /** Active negative (main/background) color. */
      case 'negative-color':
        scheme = [...this.colors.original]
        setColors(scheme, scheme.randomElement())
        break

      /** Inner and outer radius of each star. */
      case 'star-radius':
        let size = this.activeSize
        for (var i = 0; i < this.totalStars; i++) {
          size = parseInt(size - this.sizeStep.randomElement())
          if (size < this.minSize ) {
            size = this.minSize
          } 
        
          this.state.last.stars[i].innerRadius = this.state.active.stars[i].innerRadius
          this.state.last.stars[i].outerRadius = this.state.active.stars[i].outerRadius
          this.state.next.stars[i].innerRadius = size * this.radiusStep.randomElement()
          this.state.next.stars[i].outerRadius = size
        }
        break

      /** Color of each star. */
      case 'star-color':
        for (var i = 0; i < this.totalStars; i++) {
          this.state.last.stars[i].color = this.state.active.stars[i].color
          this.state.next.stars[i].color = this.colors.scheme.randomElement()
          if (i === this.totalStars - 1) {
            this.state.next.stars[i].color = this.colors.negative
          }
        }
        break

      /** Background color. */
      case 'background-color':
        this.state.last.background.color = this.state.active.background.color
        this.state.next.background.color = this.colors.negative
        break

      default:
        return
    }
  }

  /**
   * Easing function for tweening. Only applied on even intervals.
   * @param {number} t – Percent progress (0 to 1 representation) of a specific interval.
   * @param {number} i – Index of interval.
   * @returns {number}
   */
  easing(t, i, override) {
    if (override === true) { return t }

    if (this.static === true) {
      if (i) {
        if (i % 2 === 0) { return BezierEasing(0.67,1.32,.35,-0.82)(t) }
        if (i % 3 === 0) { return BezierEasing(0.76,1.93,.81,-0.57)(t) }
        if (i % 5 === 0) { return BezierEasing(.53,0.65,.81,-0.57)(t) }
      } else {
        return BezierEasing(.19,1.77,.78,-1.36)(t)
      }
    }

    if ((i && (i % 2 === 0))) {
      return BezierEasing(.2,.5,.8,1)(t)
    } else {
      return t
    }
  }

  /**
   * Determine current tween progress between "last" and "next" state based on track progress and current interval.
   * @param {string} type – Type of state to determine.
   * @param {number} i (optional) – Index of star of which to find state.
   * @returns {object || function} – Current tween state. 
   */
  determineState(type, i) {
    switch(type) {
      case 'background-color':
        let progress = Math.min((this.trackProgress - this.intervals.active.beats.start) / this.intervals.active.beats.duration, 1)
        if (progress < 0 || isNaN(progress)) { progress = 0 } 
        progress = this.easing(progress, i)
        let last = this.state.last.background.color.slice(4, -1).split(',')
        let next = this.state.next.background.color.slice(4, -1).split(',')
        return this.tweenRGB(progress, last, next)

      case 'star-radius':
        progress = Math.min((this.trackProgress - this.intervals.active.tatums.start) / this.intervals.active.tatums.duration, 1)
        if (progress < 0 || isNaN(progress)) { progress = 0 } 
        progress = this.easing(progress, i)
        const innerDiff = this.state.next.stars[i].innerRadius - this.state.last.stars[i].innerRadius
        const outerDiff = this.state.next.stars[i].outerRadius - this.state.last.stars[i].outerRadius
        return {
          innerRadius: parseInt(this.state.last.stars[i].innerRadius + (progress * innerDiff)),
          outerRadius: parseInt(this.state.last.stars[i].outerRadius + (progress * outerDiff))
        }

      case 'star-color':
        progress = Math.min((this.trackProgress - this.intervals.active.beats.start) / this.intervals.active.beats.duration, 1)
        if (progress < 0 || isNaN(progress)) { progress = 0 } 
        progress = this.easing(progress, i, true)
        last = this.state.last.stars[i].color.slice(4, -1).split(',')
        next = this.state.next.stars[i].color.slice(4, -1).split(',')
        return this.tweenRGB(progress, last, next)
      
      default:
        return
    }
  }

  /**
   * @param {number} progress – Percent color tween progress between "last" and "next" state.
   * @param {array} last – RGB array of "last" color.
   * @param {array} next - RGB array of "next" color.
   * @returns {string} – RGB string of current color.
   */
  tweenRGB(progress, last, next) {
    const diffR = parseInt(next[0], 10) - parseInt(last[0], 10)
    const diffG = parseInt(next[1], 10) - parseInt(last[1], 10)
    const diffB = parseInt(next[2], 10) - parseInt(last[2], 10)
    
    const R = parseInt( last[0], 10 )
    const G = parseInt( last[1], 10 )
    const B = parseInt( last[2], 10 )

    return `rgb(${parseInt(R + (progress*diffR), 10)},${parseInt(G + (progress*diffG), 10)},${parseInt(B + (progress*diffB), 10)})`
  }

  /**
   * Visualizer event hooks. Enable/disable <canvas> painting depending on visualizer state.
   */
  setEventHooks() {
    console.log('setEventHooks()')

    this.events.beforeStart = () => {
      this.static = false
      this.initialStart = window.performance.now()
      console.log('START requestAnimationFrame() – this.paint()')
      this.state.raf = requestAnimationFrame(this.paint.bind(this))
    }

    this.events.afterStart = () => {
      document.body.classList.add('loaded')
    }
    
    this.events.beforeStop = () => {
      console.log('CANCEL requestAnimationFrame() – {any}')
      cancelAnimationFrame(this.state.raf)
    }

    this.events.setStatic = () => {
      this.static = true
      this.setParameters()
      this.setStaticIntervals()
      document.body.classList.add('loaded')
      console.log('START requestAnimationFrame() – this.staticTween()')
      this.state.raf = requestAnimationFrame(this.staticTween.bind(this))
    }
  }

  /**
   * Main painting function; to be called recursively by window.requestAnimationFrame()
   * @param {number} timestamp – High-resolution timestamp provided by window.requestAnimationFrame()
   */
  paint(timestamp) {
    this.trackProgress = (timestamp - this.initialStart) + this.initialTrackProgress

    /**
     * If current track progress is equal to or greater than current track duration, canel paint.
     */
    if (this.trackProgress >= this.currentlyPlaying.item.duration_ms) {
      console.log('CANCEL requestAnimationFrame() – this.paint()')
      return cancelAnimationFrame(this.state.raf)
    }

    /**
     * For each interval type, find current interval.
     * If current interval index has changed, set active interval and execute interval hook.
     */
    this.intervals.types.forEach((type) => {
      const index = this.determineInterval(type)

      if (!this.intervals.active[type].start || index !== this.intervals.active[type].index) {
        this.setActiveInterval(type, index)
        this.executeHook(type, index)
      }
    })

    /** Determine and set current background color. */
    this.state.active.background.set({
      color: this.determineState('background-color')
    }).draw(this.ctx)

    /** Determine and set current star color and radius. */
    this.state.active.stars.forEach((star, i) => {
      star.set({
        ...this.determineState('star-radius', i),
        color: this.determineState('star-color', i)
      }).draw(this.ctx)
    })

    /** Recursively call painting function using window.requestAnimationFrame() */
    this.state.raf = requestAnimationFrame(this.paint.bind(this))
  }

  /**
   * Here we're faking interval data for static usage (e.g. on https://kaleidosync.herokuapp.com before you log in.)
   */
  setStaticIntervals() {

    // his.setState('star-radius')  
    // this.setState('star-color')
    // this.setState('background-color')

    console.log('setStaticIntervals()')
    this.state.static++

    this.setSingleTweenDuration()

    this.initialStart = window.performance.now()
    
    const interval = {
      start: 0,
      duration: this.singleTweenDuration
    }
    
    this.intervals.active.tatums = interval
    this.intervals.active.beats = interval
    this.intervals.active.bars = interval
    this.intervals.active.sections = interval
    this.intervals.active.segments = interval

    this.setState('star-radius')  
    if (this.state.static % 2 === 0) {
      this.setState('negative-color')
    }
    this.setState('star-color')
    this.setState('background-color')

    this.activeSize = this.activeSize === this.maxSize ? this.maxSize / 1.5 : this.maxSize
  }
  
  setSingleTweenDuration() {
    this.singleTweenDuration = Math.random() * (6000 - 1000) + 1000
  }

  /**
   * Tween using static ("fake") interval data.
   * @param {number} timestamp 
   */
  staticTween(timestamp) {
    this.trackProgress = (timestamp - this.initialStart)

    if (this.static === false) {
      console.log('CANCEL requestAnimationFrame() – this.staticTween()') 
      return cancelAnimationFrame(this.staticTween)
    }

    if (this.trackProgress >= this.singleTweenDuration) {
      this.setStaticIntervals()
      return this.state.raf = requestAnimationFrame(this.staticTween.bind(this))  
    }

    /** Determine and set current background color. */
    this.state.active.background.set({
      color: this.determineState('background-color')
    }).draw(this.ctx)

    /** Determine and set current star color and radius. */
    this.state.active.stars.forEach((star, i) => {
      star.set({
        ...this.determineState('star-radius', i),
        color: this.determineState('star-color', i)
      }).draw(this.ctx)
    })

    
    this.state.raf = requestAnimationFrame(this.staticTween.bind(this))
  }

  /**
   * Set various states based on interval changes.
   * @param {string} type – Type of interval.
   * @param {number} index (optional) – Index of interval for more granular control.
   */
  executeHook(type, index) {
    if (index === 0) {
      return
    }
    
    switch (type) {
      case 'tatums':
        this.setState('star-radius')  
        break

      case 'segments':
        this.setState('size')
        break

      case 'beats':
        this.setState('star-color')
        this.setState('background-color')
        break

      case 'bars':
        if (index % 4 === 0) {
          this.setState('color-scheme')
        } else {
          this.setState('negative-color')
        }
        break

      default:
        return
    }
  }
}

export default Kaleidoscope