/**
 * Common easing functions.
 * https://gist.github.com/gre/1650294 
 */
var b1 = 4 / 11,
    b2 = 6 / 11,
    b3 = 8 / 11,
    b4 = 3 / 4,
    b5 = 9 / 11,
    b6 = 10 / 11,
    b7 = 15 / 16,
    b8 = 21 / 22,
    b9 = 63 / 64,
    b0 = 1 / b1 / b1;

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
  easeInOutQuint (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t },
  bounceIn (t) { return 1 - easingFunctions.bounceOut(1 - t) },
  bounceOut (t) { return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9 },
  bounceInOut (t) { return ((t *= 2) <= 1 ? 1 - easingFunctions.bounceOut(1 - t) : easingFunctions.bounceOut(t - 1) + 1) / 2 }
}

/**
 * @function ease – Apply an easing function to a progress value [0 - 1].
 * @param { string } method – Selected easing function.
 * @param { integer } smoothing – Smoothing factor. Increase value to reduce the effect of the easing function.
 */
export default function ease (t, method = 'easeOutQuint', smooth = false) {
  if (!easingFunctions[method]) throw new Error(`Unknown easing function "${method}"`) 
  const eased = easingFunctions[method](t)
  if (smooth === true) {
    return (t + t + eased) / 3
  } else {
    return eased
  }
}
