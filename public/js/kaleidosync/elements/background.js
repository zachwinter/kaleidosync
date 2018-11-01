class Background {
  constructor(props) {
    this.set(props)
  }

  set(props) {
    for (var prop in props) {
      this[prop] = props[prop]
    } 

    return this
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(0, 0, this.width, this.height)
  }
}

export default Background