/**
 * @function interpolateRGB – Interpolate between two RGB strings.
 * @param a – Color A 
 * @param b – Color B
 */
export function interpolateRGB (a, b) {
  /**
   * Transform string into an array of integers. 
   * `"rgb(0,0,0)"` => `"0,0,0"` => `["0", "0", "0"]` => `[0, 0, 0]`
   */
  const last = a.slice(4, -1).split(',').map(val => parseInt(val, 10))
  const next = b.slice(4, -1).split(',').map(val => parseInt(val, 10))

  return function (progress) {
    const R = interpolateNumber(last[0], next[0])(progress)
    const G = interpolateNumber(last[1], next[1])(progress)
    const B = interpolateNumber(last[2], next[2])(progress)
    return `rgb(${R},${G},${B})`
  }	
}

/**
 * @function interpolateNumber – Interpolate between two numbers.
 * @param a – Number A
 * @param b – Number B
 */
export function interpolateNumber (a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t)
  }
}

/**
 * Interpolate between two values.
 * @param a – Value A
 * @param b – Value B
 */
export default function interpolate (a, b) {
  if (typeof a === 'string' && a.indexOf('rgb(') !== -1) {
    return interpolateRGB(a, b)
  }

  return interpolateNumber(a, b)
}