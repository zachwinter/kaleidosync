export const PI = Math.PI
export const TWO_PI = PI * 2
export const TWO_OVER_PI = PI / 2
export const PI_OVER_180 = PI / 180

import interpolateBasis from 'd3-interpolate/src/basis'

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

export function growingLineGroup (ctx, vertices) {
  const iRadius = interpolateBasis([0, 30, 0])
  for (let i = 0; i < vertices.length - 1; i++) {
    const p1 = (i/(vertices.length-1))
    const p2 = (i+1)/(vertices.length-1)
    const r1 = iRadius(p1)
    const r2 = iRadius(p2)
    growingLine(ctx, vertices[i].x, vertices[i].y, vertices[i + 1].x, vertices[i + 1].y, r1, r2)
    ctx.fill()
  }
}

export function getCenter (vertices) {
	const Ax = vertices[0].x
	const Bx = vertices[1].x
	const Cx = vertices[2].x
	const Ay = vertices[0].y
	const By = vertices[1].y
	const Cy = vertices[2].y

	const x = (Ax + Bx + Cx) / 3
	const y = (Ay + By + Cy) / 3
	return { x, y }
}

export function kaleidosdope (ctx, sides, width, height, image, offset = 0) {
  const vertices = polygon(sides, width, width/2, height/2)
  const paths = []
  const centers = []
  
  ctx.fillStyle = ctx.createPattern(image, 'repeat')

  const state = {
    offsetRotation: offset,
    offsetScale: 1.0,
    offsetX: 0,
    offsetY: 0,
    radius: width/2,
    slices: 6, 
    zoom: 3
  }

  const step = TWO_PI/state.slices
  const cx = width/2;

  for (let i = 0; i < vertices.length; i++) {
    const points = []
    const path = new Path2D()
    path.moveTo(width/2, height/2)
    points.push({ x: width/2, y: height/2 })
    path.lineTo(vertices[i].x, vertices[i].y)
    points.push({ x: vertices[i].x, y: vertices[i].y })
    path.lineTo(vertices[i === vertices.length - 1 ? 0 : i + 1].x, vertices[i === vertices.length - 1 ? 0 : i + 1].y)
    points.push({ x: vertices[i === vertices.length - 1 ? 0 : i + 1].x, y: vertices[i === vertices.length - 1 ? 0 : i + 1].y })
    path.closePath()
    const center = getCenter(points)
    paths.push(path)
    centers.push(center)
  }


  // const state = {
  //   offsetRotation: now/2000,
  //   offsetScale: 1.0,
  //   offsetX: 0,
  //   offsetY: 0,
  //   radius: width/2,
  //   slices: 6, 
  //   zoom: 3
  // }
  
  // ctx.fillStyle = ctx.createPattern(offscreenCanvas, 'repeat');
  
  // const scale = state.zoom * (state.radius / Math.min(width, height))
  // const step = TWO_PI/state.slices
  // const cx = width/2;

  // // for(let i=0; i<state.slices; i++){
  // //   ctx.save();
  // //   ctx.translate(width/2, height/2);
  // //   ctx.rotate(i * step)

  // //   ctx.beginPath();
  // //   ctx.moveTo(0, 0);
  // //   ctx.arc( 0, 0, state.radius, step * -0.5, step * 0.5)
  // //   ctx.lineTo(0, 0);
  // //   ctx.closePath()

  // //   ctx.rotate(HALF_PI)
  // //   ctx.scale(scale, scale)
  // //   ctx.scale([-1,1][i % 2], 1)
  // //   ctx.translate(state.offsetX - cx, state.offsetY)
  // //   ctx.rotate(state.offsetRotation)
  // //   ctx.scale(state.offsetScale, state.offsetScale)

  // //   ctx.fill()
  // //   ctx.restore()
  // // }

  paths.forEach((path, i) => {
    ctx.save()
    ctx.clip(path)
    ctx.translate(width/2, height/2)
    ctx.rotate(i * step)
    // ctx.scale(scale, scale)
    ctx.scale([-1,1][i % 2], 1)
    ctx.translate(state.offsetX - cx, state.offsetY)
    ctx.rotate(state.offsetRotation)
    ctx.scale(state.offsetScale, state.offsetScale)
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  })
}

export function rotateCanvas (ctx, deg, reset = true) {
  const { width, height } = ctx.canvas
  if (reset) ctx.resetTransform()
  ctx.translate(width/2, height/2)
  ctx.rotate(toRadians(deg))
  ctx.translate(-width/2, -height/2)
}

export function scaleCanvas (ctx, x, y, reset = true) {
  const { width, height } = ctx.canvas
  if (reset) ctx.resetTransform()
  ctx.translate(width/2, height/2)
  ctx.scale(x, y)
  ctx.translate(-width/2, -height/2)
}