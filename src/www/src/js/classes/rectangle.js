export default class Rectangle {
  constructor(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    } 
  }

  update(props) {
    for (var prop in props) {
      this[prop] = props[prop];
    } 
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, this.width, this.height);
  }
}