import Star from '../elements/star'
import Background from '../elements/background'
import * as Util from '../util/array'
import * as Cookie from '../util/cookie'

/**
 * @function setTokens – Retrieve and store API access tokens.
 * @param state – Application state. 
 */
export function setTokens (state) {
  state.tokens.accessToken = Cookie.get('KALEIDOSYNC_ACCESS_TOKEN')
  state.tokens.refreshToken = Cookie.get('KALEIDOSYNC_REFRESH_TOKEN')
  state.tokens.refreshCode = Cookie.get('KALEIDOSYNC_REFRESH_CODE')
  
  state.api.headers = new Headers({
    'Authorization': 'Bearer ' + state.tokens.accessToken,
    'Accept': 'application/json'
  })
}

/**
 * @function setCurrentlyPlaying – Store currently playing track.
 * @param state – Application state. 
 * @param track – Currently playing track.
 * @param analysis – Analysis data for currently playing track.
 * @param features – Audio features for currently playing track.
 * @param progress – Track progress.
 */
export function setCurrentlyPlaying (state, {
  track,
  analysis,
  features,
  progress
}) {
  state.visualizer.currentlyPlaying = track
  state.visualizer.trackAnalysis = analysis
  state.visualizer.trackFeatures = features
  state.visualizer.initialTrackProgress = progress

  startVisualizer(state)
  
  console.log('Now playing: ', state.visualizer.currentlyPlaying)
}

/**
 * @function startVisualizer 
 * @param state – Application state. 
 */
export function startVisualizer (state) {
  state.visualizer.initialized = true
  state.visualizer.active = true

  console.log('Visualizer started.')
}

/**
 * @function stopVisualizer 
 * @param state – Application state. 
 */
export function stopVisualizer (state) {
  state.visualizer.active = false

  console.log('Visualizer stopped.')
}

/**
 * @function updateTrackProgress 
 * @param state – Application state. 
 * @param progress - `progress_ms` from Spotify response.
 */
export function updateTrackProgress (state, { progress }) {
  state.visualizer.initialStart = window.performance.now()
  state.visualizer.initialTrackProgress = progress
}

/**
 * @function initParameters 
 * @param state – Application state. 
 */
export function initParameters (state) {
  const landscape = window.innerHeight < window.innerWidth

  if (landscape) {
    state.visualizer.maxSize = window.innerWidth / 2
  } else {
    state.visualizer.maxSize = window.innerHeight / 2
  }

  state.visualizer.minSize = state.visualizer.maxSize / 7
  state.visualizer.activeSize = state.visualizer.maxSize

  const { maxSize, totalStars } = state.visualizer

  state.visualizer.sizeStep = [
    (maxSize / totalStars) * 0.4,
    (maxSize / totalStars) * 0.6,
    (maxSize / totalStars) * 0.8,
    (maxSize / totalStars) * 1.0,
    (maxSize / totalStars) * 1.2,
    (maxSize / totalStars) * 1.4
  ]
}
/**
 * @function initState – Set initial state. 
 * @param state – Application state. 
 * @param canvas – Reference to <canvas> element.
 */
export function initState (state, canvas) {
  if (state.visualizer.initialized === true) return

  setColorScheme(state)

  const stars = []

  let size = state.visualizer.activeSize

  for (var i = 0; i < state.visualizer.totalStars; i++) {
    let numPoints = 24

    if ((i + 1) % 2 === 0) { numPoints = 18 }
    if ((i + 1) % 3 === 0) { numPoints = 12 }
    if ((i + 1) % 4 === 0) { numPoints = 32 }
    
    size = parseInt(size - Util.randomElement(state.visualizer.sizeStep))

    if (size < state.visualizer.minSize ) {
      size = state.visualizer.minSize
    }

    stars.push(new Star({
      x: canvas.width/2,
      y: canvas.height/2,
      points: numPoints,
      color: i === state.visualizer.totalStars - 1 ? state.visualizer.activeColorScheme.negative : Util.randomElement(state.visualizer.activeColorScheme.scheme),
      innerRadius: size * Util.randomElement(state.visualizer.radiusStep),
      outerRadius: size
    }))
  }

  const background = new Background({
    color: state.visualizer.activeColorScheme.negative,
    width: canvas.width,
    height: canvas.height
  })

  state.visualizer.stars = stars
  state.visualizer.background = background
}

/**
 * @function normalizeIntervals – Pad audio analysis data to extend full duration of track. 
 * @param state – Application state. 
 * @param track – Currently playing track.
 * @param analysis – Analysis data for currently playing track.
 */
export function normalizeIntervals (state, {
  track,
  analysis
}) {
  state.visualizer.intervalTypes.forEach((t) => {
    const type = analysis[t]

    /** Ensure first interval of each type starts at zero. */
    type[0].duration = type[0].start + type[0].duration
    type[0].start = 0

    /** Ensure last interval of each type ends at the very end of the track. */
    type[type.length - 1].duration = (track.duration_ms / 1000) - type[type.length - 1].start

    /** Convert every time value to milliseconds for our later convenience. */
    type.forEach((interval) => {
      interval.start = interval.start * 1000
      interval.duration = interval.duration * 1000
    })
  })
}

/**
 * @function setColorTheme
 * @param state – Application state.
 * @param theme – (optional) Selected color theme.
 */
export function setColorScheme (state, theme) {			
  if (theme) {
    if (theme === 'shuffle') {
      state.visualizer.colorOverride = false
    } else {
      state.visualizer.colorOverride = true
    }
  }

  const scheme = (theme && theme !== 'shuffle') ? theme : Util.randomElement(state.visualizer.colorSchemes)

  if (!scheme || !scheme.scheme) return 
  
  const negative = Util.randomElement(scheme.scheme)

  state.visualizer.colorSchemes.forEach(scheme => scheme.selected = false)
  scheme.selected = true

  const COLORS = {
    original: [...scheme.scheme],
    scheme: [...scheme.scheme],
    negative
  }

  let i = 0

  while (i < (Math.floor(Math.random() * 30) + 15)) { 
    COLORS.scheme.push(negative)
    i++
  }

  state.visualizer.activeColorScheme = COLORS
}

/**
 * @function setStarRadius
 * @param state – Application state. 
 * @param type – Type of interval attacked to this tween.
 */
export function setStarRadius (state, type) {
  let size = state.visualizer.activeSize
  state.visualizer.stars.forEach((star) => {
    size = parseInt(size - Util.randomElement(state.visualizer.sizeStep))
    
    if (size < state.visualizer.minSize ) {
      size = state.visualizer.minSize
    } 

    const innerRadius = {
      val: size * Util.randomElement(state.visualizer.radiusStep),
      interval: state.visualizer.activeIntervals[type]
    }

    const outerRadius = {
      val: size,
      interval: state.visualizer.activeIntervals[type]
    }

    star.update({
      innerRadius,
      outerRadius
    })
  })
}

/**
 * @function setStarColor
 * @param state – Application state. 
 * @param type – Type of interval attacked to this tween.
 */
export function setStarColor (state, type) {
  state.visualizer.stars.forEach((star, i) => {
    star.update({
      color: {
        val: Util.randomElement(state.visualizer.activeColorScheme.scheme),
        interval: state.visualizer.activeIntervals[type]
      }
    })
  })
}

/**
 * @function setBackgroundColor
 * @param state – Application state. 
 * @param type – Type of interval attacked to this tween.
 */
export function setBackgroundColor (state, type) {
  state.visualizer.background.update({
    val: state.visualizer.activeColorScheme.negative,
    interval: state.visualizer.activeIntervals[type]
  })
}

/**
 * @function setActiveSize
 * @param state – Application state. 
 */
export function setActiveSize (state) {
  const segment = state.visualizer.activeIntervals.segments
  const last = state.visualizer.trackAnalysis.segments[segment.index - 1] ? state.visualizer.trackAnalysis.segments[segment.index - 1].loudness_max : segment.loudness_max
  const next = state.visualizer.trackAnalysis.segments[segment.index + 1] ? state.visualizer.trackAnalysis.segments[segment.index + 1].loudness_max : segment.loudness_max
  const active = (segment.loudness_max + last + next)/3
  state.visualizer.activeSize = (state.visualizer.maxSize + (active * 25)) + (state.visualizer.trackFeatures.loudness * -15)
}

/**
 * @function setActiveInterval
 * @param state – Application state. 
 * @param type – Type of interval.
 * @param index – Index of interval tot set.
 */
export function setActiveInterval (state, { type, index }) {
  state.visualizer.activeIntervals[type] = {
    ...state.visualizer.trackAnalysis[type][index],
    index
  }
}

/**
 * @function setTrackProgress
 * @param state – Application state. 
 * @param progress – Duration in milliseconds.
 */
export function setTrackProgress (state, progress) {
  state.visualizer.trackProgress = progress
}

/**
 * @function setInitialStart
 * @param state – Application state. 
 */
export function setInitialStart (state) {
  state.visualizer.initialStart = window.performance.now()
}	