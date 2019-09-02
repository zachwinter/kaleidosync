export const PI = Math.PI
export const TWO_PI = PI * 2
export const TWO_OVER_PI = PI / 2

export function toRadians (angle) {
  return PI * angle / 180
}

export function coords (radius, theta, cx = 0, cy = 0) {
  return {
    x: (radius * Math.cos(theta) + cx),
    y: (radius * Math.sin(theta) + cy)
  }
}

export function polygon (sides, radius, cx = 0, cy = 0, rotation = 0) {
  const angle = 360/sides
  const vertices = []

  for (var i = 0; i < sides; i++) {
    const _coords = coords(radius, toRadians((angle * i) + rotation), cx, cy)
    vertices.push(_coords)
  }

  return vertices
}

export function distance (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

export function createStar (points, innerRadius, outerRadius, cx = 0, cy = 0, rotation = 0) {
  const outer = polygon(points, outerRadius, cx, cy, rotation)
  const inner = polygon(points, innerRadius, cx, cy, (360 / points / 2) + rotation)
  const vertices = []
  
  for (var i = 0; i < points; i++) {
    vertices.push({ x: outer[i].x, y: outer[i].y })
    vertices.push({ x: inner[i].x, y: inner[i].y })
  }

  return { outer, inner, vertices }
}

export function circle (ctx, radius,x, y,  start = 0, end = TWO_PI) {
  ctx.beginPath()
  ctx.arc(x, y, radius, start, end)
  ctx.closePath()
  return ctx
}

export function drawShape (ctx, vertices) {
  vertices.forEach(({ x, y }, i) => {
    if (i === 0) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()
  return ctx
}

export function graph (ctx, width, fn, tick = 5) {
  ctx.beginPath()
  for (let x = -tick; x < width + tick; x += tick) {
    if (x === 0) {
      ctx.moveTo(x, fn(x))
    } else{
      ctx.lineTo(x, fn(x))
    }
  }
  return ctx
}

export function sin (ctx, xOffset, yOffset, amplitude, frequency, tick = 5) {
  const y = x => (amplitude * Math.sin((x / frequency) + xOffset) + yOffset)
  const { width } = ctx.canvas 
  ctx.beginPath()
  for (var x = -50; x < width + 50; x += tick) {
    if (x === -50) {
      ctx.moveTo(x, y(x))
    } else {
      ctx.lineTo(x, y(x))
    }
  }
  return ctx
}

export function growingLine (ctx, x1, y1, x2, y2, startWidth, endWidth) {
  // calculate direction vector of point 1 and 2
  const perpendicularVectorAngle = Math.atan2(y2 - y1, x2 - x1) + TWO_OVER_PI
  ctx.beginPath()
  ctx.arc(x1, y1, startWidth/2, perpendicularVectorAngle, perpendicularVectorAngle + PI)
  ctx.arc(x2, y2, endWidth/2, perpendicularVectorAngle + PI, perpendicularVectorAngle)
  ctx.closePath()
  return ctx
}