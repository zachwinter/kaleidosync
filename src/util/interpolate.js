export function interpolateRGB (a, b) {
  if (!a || !b) {
    return function () {
      return false
    }
  }

  const _last = a.slice(4, -1).split(',')
  const _next = b.slice(4, -1).split(',')

  const diffR = parseInt(_next[0], 10) - parseInt(_last[0], 10)
  const diffG = parseInt(_next[1], 10) - parseInt(_last[1], 10)
  const diffB = parseInt(_next[2], 10) - parseInt(_last[2], 10)

  const R = parseInt(_last[0], 10)
  const G = parseInt(_last[1], 10)
  const B = parseInt(_last[2], 10)

  return function (progress) {
    return `rgb(${parseInt(R + (progress*diffR), 10)},${parseInt(G + (progress*diffG), 10)},${parseInt(B + (progress*diffB), 10)})`
  }	
}

export function interpolateNumber (a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t
  }
}