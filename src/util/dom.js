export function createElement (type, target = null) {
  const element = document.createElement(type)
  if (target) { target.appendChild(element) }
  return element
}

export function styleElement (el, styles) {
  for (let key in styles) {
    el.style[key] = styles[key]
  }
}

export function createStylesheet (styles) {
  const style = document.createElement('style')
  style.innerText = styles
  document.head.appendChild(style)
}