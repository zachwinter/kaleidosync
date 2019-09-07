export const KALEIDOSYNC = {
  id: 0,
  name: 'kaleidosync'
}

export const BLOBS = {
  id: 1,
  name: 'blobs'
}

export const TRAILS = {
  id: 2,
  name: 'trails',
  settings: {
    SIDES: {
      MIN: 3,
      MAX: 24,
      INITIAL: 6,
      VALUE: 6,
      STEP: 1
    },
    TRAIL_LENGTH: {
      MIN: 7,
      MAX: 25,
      INITIAL: 20,
      VALUE: 20,
      STEP: 1
    },
    ROTATION_CONSTANT: {
      MIN: 1,
      MAX: 15,
      INITIAL: 12,
      VALUE: 12,
      STEP: .25
    },
    ROTATION_MULTIPLIER: {
      MIN: 1,
      MAX: 2,
      INITIAL: 1,
      VALUE: 1,
      STEP: .1
    },
    WIDTH_CONSTANT: {
      MIN: .01,
      MAX: .05,
      INITIAL: .03,
      VALUE: .03,
      STEP: .001
    },
    GLOW_WIDTH: {
      MIN: 20,
      MAX: 100,
      INITIAL: 40,
      VALUE: 40,
      STEP: 1
    },
    SMEAR: {
      MIN: .1,
      MAX: .9,
      INITIAL: .4,
      VALUE: .4,
      STEP: .05
    }
  }
}

export const WAVESYNC = {
  id: 3,
  name: 'wavesync'
}

export default {
  KALEIDOSYNC,
  BLOBS,
  TRAILS,
  WAVESYNC
}