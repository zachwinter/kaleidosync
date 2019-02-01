const CDN = {
  promise: 'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js',
  fetch: 'https://cdnjs.cloudflare.com/ajax/libs/fetch/3.0.0/fetch.min.js',
  proxy: 'https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3.0/proxy.min.js' 
}

function loadPolyfill (feature) {
  const script = document.createElement('script')
  script.src = CDN[feature.toLowerCase()]
  script.type = 'text/javascript'
  script.async = false
  document.getElementsByTagName('head')[0].appendChild(script)
}

export function isSupported (feature) {
  switch (feature.toLowerCase()) {
    case 'promise':
      return 'Promise' in window &&
        'resolve' in window.Promise &&
        'reject' in window.Promise &&
        'all' in window.Promise &&
        'race' in window.Promise &&
        (function() {
          let resolve
          new window.Promise(function(r) { resolve = r })
          return typeof resolve === 'function'
        }())
    case 'fetch':
      return 'fetch' in window
    case 'proxy':
      return 'Proxy' in window
  }
}

export default function polyfill (features = []) {
  features.forEach(feature => {
    if (!isSupported(feature)) {
      loadPolyfill(feature)
    }
  })
}