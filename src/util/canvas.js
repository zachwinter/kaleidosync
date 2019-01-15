export const PI = Math.PI
export const PI2 = PI * 2

/**
 * @function initCanvas – Create & return <canvas> and 2D context. 
 */
export function initCanvas () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  sizeCanvas(canvas)
  return { canvas, ctx }
}	

/**
 * @function sizeCanvas – Set <canvas> artboard to window size. 
 * @param canvas – Reference to <canvas> element.
 */
export function sizeCanvas (canvas) {
  const dpi = 1
  canvas.width = window.innerWidth * dpi
  canvas.height = window.innerHeight * dpi
  return canvas
}

/**
 * @function createPath – Create a path given an array of vertices; returns 2D context. 
 * @param ctx – <canvas> 2D context.
 * @param vertices – Array of { x, y } vertices. 
 */
export function createPath (ctx, vertices) {
  ctx.beginPath()

  for (var i = 0; i < vertices.length; i++) {
    const { x, y } = vertices[i]

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  
  ctx.closePath()

  return ctx
}