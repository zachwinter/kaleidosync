/**
 * @class Sketch - a simple 2d <canvas> animation interface. 
 */
export default class Sketch {
  constructor ({
    main = null,
    container = document.body,
    width = window.innerWidth,
    height = window.innerHeight,
    hidpi = null,
    fill = null,
    name,
  } = {}) {
    this.container = container
    this.width = width
    this.height = height
    this.hidpi = hidpi
    this.dpi = hidpi ? Math.min(hidpi, 2) : 1
    this.active = false
    this.queue = []
    this.fill = fill
    this.canvas = document.createElement('canvas')
    this.canvas.setAttribute('id', name)
    this.ctx = this.canvas.getContext('2d')
    this.offscreenCanvas = document.createElement('canvas')
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')
    this.container.appendChild(this.canvas)
    this.setSize()

    if (width === window.innerWidth && height == window.innerHeight) {
      window.addEventListener('resize', () => {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.setSize()
      })
    }

    this.mouse = {
      x: 0,
      y: 0
    }

    this.canvas.addEventListener('mousemove', ({ pageX, pageY }) => {
      this.mouse = {
        x: pageX,
        y: pageY
      }
    })

    if (main !== null) {
      this.add('main', main)
    }
  }

  setSize (hidpi = false) {
    this.dpi = hidpi ? Math.min(window.devicePixelRatio, 2) : 1
    this.canvas.width = this.width * this.dpi
    this.canvas.height = this.height * this.dpi
    this.canvas.style.width = this.width + 'px'
    this.canvas.style.height = this.height + 'px'
    this.offscreenCanvas.width = this.width * this.dpi
    this.offscreenCanvas.height = this.height * this.dpi
    this.ctx.scale(this.dpi , this.dpi) 
    this.offscreenCtx.scale(this.dpi, this.dpi)
  }
  
  /**
   * @method add – Add an item to the animation queue.
   * 
   * NOTE: If duration is specified, the item will remove itself from the queue upon completion.
   * 
   * @param {string} name 
   * @param {function} method 
   * @param {number} duration 
   */
  add (name, method, duration = null) {
    this.queue.push({
      name,
      method,
      duration,
      start: window.performance.now()
    })
  }

  /**
   * @method remove - Remove an item from the animation queue by name.
   * @param {string} name 
   */
  remove (name) {
    this.queue = this.queue.filter(item => item.name !== name)
  }

  /**
   * @method start - Begin animation loop.
   */
  start () {
    if (this.active === true) return
    this.active = true
    requestAnimationFrame(this.loop.bind(this))
  }

  /**
   * @method stop - Stop animation loop.
   */
  stop () {
    if (this.active === false) return
    this.active = false
    cancelAnimationFrame(this.loop.bind(this))
  }

  /**
   * @method paint - Paint a single item in the animation queue.
   * @param {DOMHighResTimeStamp} now  
   * @param {object} - Item in the animation queue. 
   */
  paint (now, { name, start, duration, method }) {
    const elapsed = now - start
    const progress = typeof duration === 'number'
      ? Math.min(elapsed / duration, 1)
      : null
    const state = {
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      largest: this.width > this.height ? this.width : this.height,
      smallest: this.width > this.height ? this.height : this.width,
      offscreen: this.offscreenCtx,
      now,
      progress,
      duration,
      elapsed,
      start,
      mouse: this.mouse
    }

    if (this.fill) {
      this.ctx.save()
      this.ctx.globalCompositeOperation = 'source-over'
      this.ctx.fillStyle = this.fill
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.restore()
    }

    method(state)

    if (progress === 1) {
      this.remove(name)
    }
  }

  loop (now) { 
    if (this.active === true) {
      requestAnimationFrame(this.loop.bind(this))
    }

    this.queue.forEach(item => this.paint(now, item))
  }
}