const PI = Math.PI
const ROTATION = PI/2*3

class Star {
  constructor(props) {
    this.set(props)
    this.step = PI/this.points
  }

  set(props) {
    for (var prop in props) {
      this[prop] = props[prop]
    } 

    return this
  }

  draw(ctx) {
    let rotation = ROTATION
    let x = this.x
    let y = this.y

    ctx.beginPath(this.points) 
    ctx.moveTo(this.x, this.y - this.outerRadius)

    for (var i = 0; i < this.points; i++) {
      x = this.x + Math.cos(rotation) * this.outerRadius
      y = this.y + Math.sin(rotation) * this.outerRadius
      ctx.lineTo(x, y)
      rotation += this.step
      x = this.x + Math.cos(rotation) * this.innerRadius
      y = this.y + Math.sin(rotation) * this.innerRadius
      ctx.lineTo(x, y)
      rotation += this.step
    }
    
    ctx.lineTo(this.x, this.y - this.outerRadius)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }
} 

export default Star