/**
 * https://stackoverflow.com/a/31732310
 */
export function detectSafari () {
  return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;
}

export function detectMobile () {
  /**
   * Yes, I know this is absurd. But all I'm doing is determining if the browser is supported by
   * Spotify's Web Playback SDK... and this happens to work. 
   */
  return 'ontouchstart' in document.documentElement
}