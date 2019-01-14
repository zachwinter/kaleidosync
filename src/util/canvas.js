function initCanvas () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  sizeCanvas(canvas)
  document.body.appendChild(canvas)
  return { canvas, ctx }
}	

function sizeCanvas (canvas) {
  const dpi = 1
  canvas.width = window.innerWidth * dpi
  canvas.height = window.innerHeight * dpi
  return canvas
}

export {
  initCanvas,
  sizeCanvas
}