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
    intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
    activeIntervals: Observe({
      tatums: {},
      segments: {},
      beats: {},
      bars: {},
      sections: {}
    }),
    currentlyPlaying: {},
    trackAnalysis: {},
    trackFeatures: {},
    initialTrackProgress: 0,
    initialStart: 0,
    trackProgress: 0,
    active: false,
    initialized: false,
    drawing: false,
    totalStars: 24,
    minSize: 0,
    maxSize: 0,
    activeSize: 0,
    radiusStep: [.3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2],
    sizeStep: [],
    stars: [],
    background: {},
    colorSchemes: Colors.map(scheme => {
      return { scheme, selected: false }
    }),
    albumArtworkTheme: null,
    activeColorScheme: [],
    useThemeFromArtwork: false,
    colorOverride: false
  })
}

export default Observe(state)