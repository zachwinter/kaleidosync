
export const PI = Math.PI
export const PI2 = PI * 2

/**
 * @function createCanvas – Create & return <canvas>. Optionally, insert into DOM.
 */
export function createCanvas (append = true, container = document.body) {
  const canvas = document.createElement('canvas')

  if (append) {
    container.appendChild(canvas)
  }

  return canvas
}

/**
 * @function sizeCanvasArtboard – Size inline <canvas> inline width/height values.
 * @param canvas – Reference to <canvas> element.
 */
export function sizeCanvasArtboard (canvas, width = window.innerWidth, height = window.innerHeight, hidpi = false) {
  const dpi = window.devicePixelRatio ? window.devicePixelRatio : 1
  canvas.width = width * (hidpi ? dpi : 1)
  canvas.height = height * (hidpi ? dpi : 1)
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

/**
 * @function toRadians – Convert degrees to radians.
 */
export function toRadians (angle) {
  return PI * angle / 180
}

/**
 * @function getCoords – Get Cartesian coordinates.
 */
export function getCoords (radius, angle, cx = 0, cy = 0) {
  return {
    x: radius * Math.cos(angle) + cx,
    y: radius * Math.sin(angle) + cy
  }
}

/**
 * @function createPolygon – Generate polygon vertices (array of `{ x, y }` Cartesian coordinates).
 * @param sides – Number of polygon sides. 
 * @param radius – Polygon radius.
 * @param cx – Horizontal shift.
 * @param cy – Vertical shift.
 * @param rotation – Rotation in degrees.
 */
export function createPolygon (sides, radius, cx = 0, cy = 0, rotation = 0) {
  const angle = 360/sides
  const vertices = []

  for (var i = 0; i < sides; i++) {
    const coords = getCoords(radius, toRadians((angle * i) + rotation), cx, cy)
    vertices.push(coords)
  }

  return vertices
}

/**
 * @function createStar – Generate star vertices (array of `{ x, y }` Cartesian coordinates).
 * @param points – Number of star points. 
 * @param innerRadius – Inner radius of star.
 * @param outerRadius – Outer radius of star.
 * @param cx – Horizontal shift.
 * @param cy – Vertical shift.
 * @param rotation – Rotation in degrees.
 */
export function createStar (points, innerRadius, outerRadius, cx = 0, cy = 0, rotation = 0) {
  const outer = createPolygon(points, outerRadius, cx, cy, rotation)
  const inner = createPolygon(points, innerRadius, cx, cy, (360 / points / 2) + rotation)
  const vertices = []

  for (var i = 0; i < points; i++) {
    vertices.push({ x: outer[i].x, y: outer[i].y })
    vertices.push({ x: inner[i].x, y: inner[i].y })
  }

  return vertices
}