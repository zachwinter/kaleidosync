export function isString (s) {
  return typeof s === 'string'
}

export function isColor (c) {
  if (!isString(c)) return false
  return isRGB(c) || isHex(c) || isRGBA(c)
}

export function isRGB (c) {
  return (c.indexOf('rgb') !== -1) && (c.indexOf('rgba') === -1)
}

export function isRGBA (c) {
  return (c.indexOf('rgba') !== -1)
}

export function isHex (c) {
  return (c.indexOf('#') !== -1)
}

export function stripSpaces (c) {
  return c.replace(/ /g, '')
}

export function getNumericValues (c) {
  const i = isRGBA(c) ? 5 : 4
  return c.slice(i, -1).split(',').map(val => parseInt(val, 10))
}

export function toRGB (c) {
  if (isRGB(c)) return c
  
  let hex = c.replace('#', '')

  if (hex.length === 3) {
    hex = hex + hex
  }

  const r = parseInt(hex.substring(0,2), 16)
  const g = parseInt(hex.substring(2,4), 16)
  const b = parseInt(hex.substring(4,6), 16)

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid color.')
  }

  return `rgb(${r},${g},${b})`
}

export function toRGBA (c, a = 1) {
  const [r, g, b] = getNumericValues(c)
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid color.')
  }

  return `rgba(${r},${g},${b},${a})`
}

export function toHex (color) {
  const [r, g, b] = getNumericValues(color)
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export function brightness (color, multiplier) {
  const { r, g, b, a } = color
  const max = [255 / r, 255 / g, 255 / b].reduce((a, b) => (b < a) ? b : a)
  const min = ([(1 / (r + 1)), (1 / (g + 1)), (1 / (b + 1))].reduce((a, b) => (b < a) ? b : a))
  const m = Math.max(Math.min(multiplier, max), min) 

  return {
    ...color,
    r: ~~(r * m),
    g: ~~(g * m),
    b: ~~(b * m),
    a
  }
}

export function rgb2hsv (r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => ~~(num * 100) / 100;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = (1 / 3) + rr - bb;
    } else if (babs === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: ~~(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100)
  };
}

export function color (color) {
  if (!isColor(color)) throw new Error('Invalid color.')

  let c = stripSpaces(color)
  let hex = ''
  let rgb = ''

  if (isHex(c)) {
    hex = c
    c = toRGB(c)
  }

  if (isRGB(c)) {
    rgb = c
    c = toRGBA(c)
  }

  const [ r, g, b, a ] = getNumericValues(c)

  return {
    __original: color,
    rgba: c,
    rgb,
    hex,
    r,
    g,
    b, 
    a,
    alpha: (alpha) => `rgba(${r},${g},${b},${alpha})`
  }
}