export function buildUniforms (uni) {
  const uniforms = {...uni}
  const bools = Object.keys(uniforms).filter(key => uniforms[key].type === 'boolean').map(key => uniforms[key])
  bools.forEach(({ name }) => {
    uniforms[`${name}Tween`] = { value: false, type: 'boolean', visible: false }
    uniforms[`${name}TweenProgress`] = { value: 0, type: 'number', visible: false }
  })
  return uniforms
}

export function getBooleanChanges(val, old) {
  const booleans = getBooleans(val)
  const oldBooleans = getBooleans(old)
  const changes = []
  Object.keys(booleans).forEach(key => {
    const { name, value } = booleans[key]
    if (!oldBooleans[name]) return
    if (oldBooleans[name].value !== value) changes.push(name)
  })
  return changes
}

export function getBooleans(uniforms) {
  return _getUniformsByType(uniforms, 'boolean')
}

export function getTweenableChanges(to, from) {
  try {
    return Object.keys(from).reduce((acc, key) => {
      if (from[key].type === 'boolean' || from[key].visible === false) return acc
      const tweenable = ['min', 'max', 'value', 'step']
      tweenable.forEach(val => {
        if (to[key][val] !== from[key][val]) {
          acc[key] = acc[key] || []
          acc[key].push(val)
        }
      })
      return acc
    }, {})
  } catch (e) {
    return {}
  }
}

function _getUniformsByType (src, type) {
  return Object.keys(src).filter(v => src[v].type === type).reduce((acc, key) => {
    if (src[key].visible === false) return acc
    acc[key] = src[key]
    return acc
  }, {})
}