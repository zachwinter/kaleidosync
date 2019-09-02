/**
 * Common easing functions.
 * https://gist.github.com/gre/1650294 
 */
export const easingFunctions = {
  linear (t) { return t },
  easeInQuad (t) { return t * t },
  easeOutQuad (t) { return t * (2 - t) },
  easeInOutQuad (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
  easeInCubic (t) { return t * t * t },
  easeOutCubic (t) { return (--t) * t * t + 1 },
  easeInOutCubic (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
  easeInQuart (t) { return t * t * t * t },
  easeOutQuart (t) { return 1 - (--t) * t * t * t },
  easeInOutQuart (t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
  easeInQuint (t) { return t * t * t * t * t },
  easeOutQuint (t) { return 1 + (--t) * t * t * t * t },
  easeInOutQuint (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}

/**
 * @function ease – Apply an easing function to a progress value [0 - 1].
 * @param { string } method – Selected easing function.
 * @param { integer } smoothing – Smoothing factor. Increase value to reduce the effect of the easing function.
 */
export default function ease (t, method = 'easeInOutQuart', smooth = false) {
  if (!easingFunctions[method]) throw new Error(`Unknown easing function "${method}"`) 
  const eased = easingFunctions[method](t)
  if (smooth === true) {
    return (t + t + eased) / 3
  } else {
    return eased
  }
}
