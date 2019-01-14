import Star from '../elements/star'
import Background from '../elements/background'
import { sizeCanvas } from '../util/canvas'
import * as Util from '../util/array'
import * as Cookie from '../util/cookie'

/**
 * @function setTokens – Retrieve and store API access tokens.
 * @param state – Application state. 
 */
export function setTokens ({ tokens, api }) {
  tokens.accessToken = Cookie.get('KALEIDOSYNC_ACCESS_TOKEN')
  tokens.refreshToken = Cookie.get('KALEIDOSYNC_REFRESH_TOKEN')
  tokens.refreshCode = Cookie.get('KALEIDOSYNC_REFRESH_CODE')
  
  api.headers = new Headers({
    'Authorization': 'Bearer ' + tokens.accessToken,
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
  const { visualizer } = state

  visualizer.currentlyPlaying = track
  visualizer.trackAnalysis = analysis
  visualizer.trackFeatures = features
  visualizer.initialTrackProgress = progress

  startVisualizer(state)
  
  console.log('Now playing: ', visualizer.currentlyPlaying)
}

/**
 * @function startVisualizer 
 * @param state – Application state. 
 */
export function startVisualizer ({ visualizer }) {
  visualizer.initialized = true
  visualizer.active = true

  console.log('Visualizer started.')
}

/**
 * @function stopVisualizer 
 * @param state – Application state. 
 */
export function stopVisualizer ({ visualizer }) {
  visualizer.active = false

  console.log('Visualizer stopped.')
}

/**
 * @function updateTrackProgress 
 * @param state – Application state. 
 * @param progress - `progress_ms` from Spotify response.
 */
export function updateTrackProgress ({ visualizer }, { progress }) {
  visualizer.initialStart = window.performance.now()
  visualizer.initialTrackProgress = progress
}

/**
 * @function initParameters 
 * @param state – Application state. 
 */
export function initParameters ({ visualizer }) {
  const landscape = window.innerHeight < window.innerWidth

  if (landscape) {
    visualizer.maxSize = window.innerWidth / 2
  } else {
    visualizer.maxSize = window.innerHeight / 2
  }

  visualizer.minSize = visualizer.maxSize / 7
  visualizer.activeSize = visualizer.maxSize

  const { maxSize, totalStars } = visualizer

  visualizer.sizeStep = [
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
  const { visualizer } = state

  if (visualizer.initialized === true) return

  setColorScheme(state)

  const stars = []

  let size = visualizer.activeSize

  for (var i = 0; i < visualizer.totalStars; i++) {
    let numPoints = 24

    if ((i + 1) % 2 === 0) { numPoints = 18 }
    if ((i + 1) % 3 === 0) { numPoints = 12 }
    if ((i + 1) % 4 === 0) { numPoints = 32 }
    
    size = parseInt(size - Util.randomElement(visualizer.sizeStep))

    if (size < visualizer.minSize ) {
      size = visualizer.minSize
    }

    stars.push(new Star({
      x: canvas.width/2,
      y: canvas.height/2,
      points: numPoints,
      color: i === visualizer.totalStars - 1 ? visualizer.activeColorScheme.negative : Util.randomElement(visualizer.activeColorScheme.scheme),
      innerRadius: size * Util.randomElement(visualizer.radiusStep),
      outerRadius: size
    }))
  }

  const background = new Background({
    color: visualizer.activeColorScheme.negative,
    width: canvas.width,
    height: canvas.height
  })

  visualizer.stars = stars
  visualizer.background = background
}

/**
 * @function normalizeIntervals – Pad audio analysis data to extend full duration of track. 
 * @param state – Application state. 
 * @param track – Currently playing track.
 * @param analysis – Analysis data for currently playing track.
 */
export function normalizeIntervals ({ visualizer }, { track, analysis }) {
  visualizer.intervalTypes.forEach((t) => {
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
export function setColorScheme ({ visualizer }, theme) {			
  if (theme) {
    if (theme === 'shuffle') {
      visualizer.colorOverride = false
    } else {
      visualizer.colorOverride = true
    }
  }

  const scheme = (theme && theme !== 'shuffle') ? theme : Util.randomElement(visualizer.colorSchemes)

  if (!scheme || !scheme.scheme) return 
  
  const negative = Util.randomElement(scheme.scheme)

  visualizer.colorSchemes.forEach(scheme => scheme.selected = false)
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

  visualizer.activeColorScheme = COLORS
}

/**
 * @function setStarRadius
 * @param state – Application state. 
 * @param type – Type of interval attacked to this tween.
 */
export function setStarRadius ({ visualizer }, type) {
  let size = visualizer.activeSize
  visualizer.stars.forEach((star) => {
    size = parseInt(size - Util.randomElement(visualizer.sizeStep))
    
    if (size < visualizer.minSize ) {
      size = visualizer.minSize
    } 

    const innerRadius = {
      val: size * Util.randomElement(visualizer.radiusStep),
      interval: visualizer.activeIntervals[type]
    }

    const outerRadius = {
      val: size,
      interval: visualizer.activeIntervals[type]
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
export function setStarColor ({ visualizer }, type) {
  visualizer.stars.forEach((star, i) => {
    star.update({
      color: {
        val: Util.randomElement(visualizer.activeColorScheme.scheme),
        interval: visualizer.activeIntervals[type]
      }
    })
  })
}

/**
 * @function setBackgroundColor
 * @param state – Application state. 
 * @param type – Type of interval attacked to this tween.
 */
export function setBackgroundColor ({ visualizer }, type) {
  visualizer.background.update({
    val: visualizer.activeColorScheme.negative,
    interval: visualizer.activeIntervals[type]
  })
}

/**
 * @function setActiveSize
 * @param state – Application state. 
 */
export function setActiveSize ({ visualizer }) {
  const segment = visualizer.activeIntervals.segments
  const last = visualizer.trackAnalysis.segments[segment.index - 1] ? visualizer.trackAnalysis.segments[segment.index - 1].loudness_max : segment.loudness_max
  const next = visualizer.trackAnalysis.segments[segment.index + 1] ? visualizer.trackAnalysis.segments[segment.index + 1].loudness_max : segment.loudness_max
  const active = (segment.loudness_max + last + next)/3
  visualizer.activeSize = (visualizer.maxSize + (active * 25)) + (visualizer.trackFeatures.loudness * -15)
}

/**
 * @function setActiveInterval
 * @param state – Application state. 
 * @param type – Type of interval.
 * @param index – Index of interval tot set.
 */
export function setActiveInterval ({ visualizer }, { type, index }) {
  visualizer.activeIntervals[type] = {
    ...visualizer.trackAnalysis[type][index],
    index
  }
}

/**
 * @function setTrackProgress
 * @param state – Application state. 
 * @param progress – Duration in milliseconds.
 */
export function setTrackProgress ({ visualizer }, progress) {
  visualizer.trackProgress = progress
}

/**
 * @function setInitialStart
 * @param state – Application state. 
 */
export function setInitialStart ({ visualizer }) {
  visualizer.initialStart = window.performance.now()
}

/**
 * @function paint – Paint a single frame.
 */
export function paint ({ visualizer }, { canvas, ctx }) {
  /** Pass <canvas> 2d context, <canvas> width & height, and current track progress to background, then paint. */
  visualizer.background.draw({
    ctx,
    width: canvas.width,
    height: canvas.height,
    trackProgress: visualizer.trackProgress
  })
  
  /** Pass <canvas> 2d context and current track progress to each star, then paint. */
  visualizer.stars.forEach(star => {
    star.draw({
      ctx,
      trackProgress: visualizer.trackProgress
    })
  })
}

/**
 * @function setActiveIntervals – Determine and set active intervals of each type, based on track progress.
 * @param state – Application state.
 */
export function setActiveIntervals (state) {
  const { visualizer } = state

  const determineInterval = (type) => {
    for (let i = 0; i < visualizer.trackAnalysis[type].length; i++) {
      /** If last interval... */
      if (i === (visualizer.trackAnalysis[type].length - 1)) {
        return i
      }
  
      /** If current track progress falls within current interval. */
      if (visualizer.trackAnalysis[type][i].start < visualizer.trackProgress && visualizer.trackProgress < visualizer.trackAnalysis[type][i + 1].start) {
        return i
      }
    }
  
    return -1
  }

  /** For each interval type... */
  visualizer.intervalTypes.forEach(type => {
    const index = determineInterval(type)

    /** Update active interval if it's different from last check. */
    if (!visualizer.activeIntervals[type].start || index !== visualizer.activeIntervals[type].index) {
      setActiveInterval(state, { type, index })
    }
  })
}

/**
 * @function resizeElements – Resize <canvas> and adjust star positioning.
 * @param state - Application state.
 * @param canvas – Reference to <canvas> element.
 */
export function resizeElements (state, canvas) {
  initParameters(state)
  sizeCanvas(canvas)

  state.visualizer.stars.forEach(star => {
    star.x = canvas.width / 2
    star.y = canvas.height / 2
  })
}