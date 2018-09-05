class Canvas {
  constructor(canvas) {
    this.isMobile = window.matchMedia('(max-width: 480px)').matches
    this.width = this.isMobile ? window.innerWidth * 2 : window.innerWidth
    this.height = this.isMobile ? window.innerHeight * 2 : window.innerHeight
    this.node = document.getElementById(canvas)
    this.node.removeAttribute('style')
    this.node.width = this.width
    this.node.height = this.height
    this.ctx = this.node.getContext('2d')
    this.stars = []
    this.background = {}
    this.raf
    this.initialized = false
    this.isPainting = false

    if (this.isMobile) {
      this.node.style.transform = 'scale(.5) translateY(-50%) translateX(-50%)'
    }
  }

  addStar(el) {
    this.stars.push(el)
  }

  addBackground(el) {
    this.background = el
  }

  paint() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.background.draw(this.ctx);
    this.stars.forEach((el) => el.draw(this.ctx))
    this.raf = requestAnimationFrame(this.paint.bind(this))
  }

  startPaint() {
    if (!this.isPainting) {
      this.paint()
      this.isPainting = true
    }
  }

  stopPaint() {
    if (this.isPainting) {
      cancelAnimationFrame(this.raf)
      this.isPainting = false
    }
  }

  init() {
    if (this.initialized === false) {
      this.startPaint()
      this.isPainting = true
      this.initialized = true
    }
  }
}

export default Canvas