import Observe from './observe.js'
import Colors from '../elements/colors'

const state = {
  api: {
    currentlyPlaying: 'https://api.spotify.com/v1/me/player',
    trackAnalysis: 'https://api.spotify.com/v1/audio-analysis/',
    trackFeatures: 'https://api.spotify.com/v1/audio-features/',
    seek: 'https://api.spotify.com/v1/me/player/seek',
    headers: {},
    pingDelay: 1000
  },

  tokens: {
    accessToken: '',
    refreshToken: '',
    refreshCode: ''
  },

  visualizer: Observe({
    /** Too expensive to be worth it. */
    hidpi: false, 

    /** Echo Nest interval types, for iteration brevity. */
    intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],

    /** References to currently active intervals, per track progress. */
    activeIntervals: Observe({
      tatums: {},
      segments: {},
      beats: {},
      bars: {},
      sections: {}
    }),

    /** Current track, track analysis, and track features. */
    currentlyPlaying: {},
    trackAnalysis: {},
    trackFeatures: {},

    /** Timestamps & progress. */
    initialTrackProgress: 0,
    initialStart: 0,
    trackProgress: 0,

    /** Playing state. */
    active: false,
    initialized: false,
    drawing: false,

    /** Look and feel. */
    totalStars: 24,
    minSize: 0,
    maxSize: 0,
    activeSize: 0,
    radiusStep: [.3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2],
    sizeStep: [],
    colorSchemes: Colors.map(scheme => {
      return { scheme, selected: false }
    }),

    /** Models. */
    stars: [],
    background: {},
    activeColorScheme: {}
  })
}

export default Observe(state)