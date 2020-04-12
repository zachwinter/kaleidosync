export const SET_MODEL = 'SET_MODEL'
export const SET_BACKGROUND = 'SET_BACKGROUND'

export function initialModel () {
  return [{
    "sides": "6",
    "length": "23",
    "width": "0.34",
    "rotation": "0.03",
    "color": {
      "rgba": {
        "r": 164,
        "g": 24,
        "b": 187,
        "a": 1
      },
      "hex": "#A418BB",
      "hsl": {
        "h": 291.34020618556696,
        "s": 0.7684000000000002,
        "l": 0.4146,
        "a": 1
      },
      "hex8": "#A418BBFF",
      "hsv": {
        "h": 291.34020618556696,
        "s": 0.869034155168514,
        "v": 0.7331786400000001,
        "a": 1
      },
      "oldHue": 291.340206185567,
      "source": "hsl",
      "a": 1
    },
    "radius": "0.23",
    "blending": "lighter",
    "scale": false,
    "colorPickerVisible": true
  }]
}

export function initialBackground () {
  return {
    "hsl": {
      "h": 256.59574468085106,
      "s": 0,
      "l": 0,
      "a": 0.14
    },
    "hex": "#000000",
    "hex8": "#00000024",
    "rgba": {
      "r": 0,
      "g": 0,
      "b": 0,
      "a": 0.14
    },
    "hsv": {
      "h": 256.59574468085106,
      "s": 0,
      "v": 0,
      "a": 0.14
    },
    "oldHue": 256.59574468085106,
    "source": "rgba",
    "a": 0.14
  }
}

export default {
  namespaced: true,
  state: {
    model: initialModel(),
    background: initialBackground()
  },
  mutations: {
    [SET_MODEL] (state, val) {
      state.model = val
    },
    [SET_BACKGROUND] (state, val) {
      state.background = val
    }
  },
  actions: {
    addRing ({ state, commit }) {
      const ring = {...state.model[state.model.length - 1]}
      ring.radius = ring.radius * .5
      commit(SET_MODEL, [...state.model, ring])
    }
  }
}