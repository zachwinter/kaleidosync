import Observe from '@zach.winter/common/js/observe'

export default function initLoop (cb = () => {}) {
  /**
   * For anyone who's paying attention, I originally had a single rAF loop, in which I would commit the current
   * timestamp, and then `watch` that property to drive animations. Works great! Until you try to use Vue dev tools.
   * They're not meant to handle that many mutations per second, even if the mutations don't affect the DOM.
   *
   * Here we have the same functionality using Proxies under the hood:
   */
  
  window.__KALEIDOSYNC_LOOP__ = Observe({
    tick: 0,
    activeIntervals: null,
    volume: 0,
    trackProgress: 0,
    trackProgressMs: 0,
    hover: false,
    hoverTimeout: null
  })

  /**
   * And with it, you can do:
   * 
   * window.__KALEIDOSYNC_LOOP__.watch('tick', now => console.log(now))
   */

  const tick = (now) => {
    window.requestAnimationFrame(tick)
    window.__KALEIDOSYNC_LOOP__.tick = now
    cb()
  }

  window.requestAnimationFrame(tick)
}