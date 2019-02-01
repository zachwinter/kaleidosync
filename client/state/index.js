import Observe from './observe.js'

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
    colorSchemes: [
      [
        'rgb(255,159,28)',
        'rgb(255,191,105)',
        'rgb(203,243,240)',
        'rgb(46,196,182)',
        'rgb(255,255,255)'
      ],
      [
        'rgb(229,99,153)',
        'rgb(210,241,228)', 
        'rgb(251,202,239)', 
        'rgb(72,48,77)',    
        'rgb(255,255,255)'
      ],
      [
        'rgb(198,0,66)',
        'rgb(255,119,168)',
        'rgb(226,206,239)',
        'rgb(255,198,217)',
        'rgb(255,255,255)'
      ],
      [
        'rgb(118,229,252)',
        'rgb(27,154,170)',
        'rgb(157,172,255)',
        'rgb(61,52,139)',
        'rgb(238,251,255)'
      ],
      [
        'rgb(10,36,99)',
        'rgb(62,146,204)',
        'rgb(255,250,255)',
        'rgb(216,49,91)',
        'rgb(39,27,24)'
      ]
    ].map(scheme => {
      return { scheme, selected: false }
    }),

    /** Models. */
    stars: [],
    background: {},
    activeColorScheme: {}
  })
}

export default Observe(state)