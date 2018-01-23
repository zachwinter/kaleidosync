export default class Canvas {
  constructor(canvas) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.node = document.getElementById(canvas);
    this.node.width = this.width;
    this.node.height = this.height;
    this.ctx = this.node.getContext('2d');
    this.stars = [];
    this.background = {};
    this.raf;
    this.isInitialized = false;
    this.isPainting = false;
  }

  addStar(el) {
    this.stars.push(el);
  }

  addBackground(el) {
    this.background = el;
  }

  paint() {
    this.ctx.clearRect(0, 0, this.node.width, this.node.height);

    this.background.draw(this.ctx);

    this.stars.forEach((el) => {
      el.draw(this.ctx);
    });

    this.raf = requestAnimationFrame(this.paint.bind(this));
  }

  startPaint() {
    this.paint();
    this.isPainting = true;
  }

  stopPaint() {
    cancelAnimationFrame(this.raf);
    this.isPainting = false;
  }

  init() {
    if (this.isInitialized === false) {
      this.startPaint();
      this.isPainting = true;
      this.isInitialized = true;
    }
  }
}