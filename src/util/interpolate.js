/**
 * @function interpolateRGB – Interpolate between two RGB strings in the format `rgb(0,0,0)`
 * @param a – Color A 
 * @param b – Color B
 */
export function interpolateRGB (a, b) {
  if (!a || !b) {
    return function () {
      return false
    }
  }

  /**
   * Transform string to array of integers. 
   * `"rgb(0,0,0)"` => `"0,0,0"` => `["0", "0", "0"]` => `[0, 0, 0]`
   */
  const last = a.slice(4, -1).split(',').map(val => parseInt(val, 10))
  const next = b.slice(4, -1).split(',').map(val => parseInt(val, 10))

  return function (progress) {
    const R = last[0] + (next[0] - last[0]) * progress
    const G = last[1] + (next[1] - last[1]) * progress
    const B = last[2] + (next[2] - last[2]) * progress

    return `rgb(${R},${G},${B})`
  }	
}

/**
 * @function interpolateNumber – Interpolate between two numbers.
 * @param a – Number A
 * @param b – Number B
 */
export function interpolateNumber (a, b) {
  if (!a || !b) {
    return function () {
      return false
    }
  }
  
  return a = +a, b -= a, function(t) {
    return a + b * t
  }
}