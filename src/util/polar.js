export const PI = Math.PI
export const PI2 = PI * 2
export const PI180 = PI / 180

/**
 * @function toRadians – Convert degrees to radians.
 * @param angle – Angle in degrees.
 */
export function toRadians (angle) {
  return PI * angle / 180
}

/**
 * @function x – Get Cartesian `x` coordinate.
 */
export function x (radius, angle, cx = 0) {
  return radius * Math.cos(angle) + cx
}

/**
 * @function y – Get Cartesian `y` coordinate.
 */
export function y (radius, angle, cy = 0) {
  return radius * Math.sin(angle) + cy
}

/**
 * @function coords – Get Cartesian coordinates.
 */
export function coords (radius, angle, cx = 0, cy = 0) {
  return {
    x: x(radius, angle, cx),
    y: y(radius, angle, cy)
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
    const _coords = coords(radius, toRadians((angle * i) + rotation), cx, cy)
    vertices.push(_coords)
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