import { initialTrailsState, initialTrailsBackground } from './trails'

export default {
  api: {
    authID: null,
    accessToken: null,
    refreshToken: null,
    refreshCode: null,
    headers: null
  },
  intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
  activeIntervals: {
    tatums: {},
    segments: {},
    beats: {},
    bars: {},
    sections: {},
  },
  currentlyPlaying: {},
  trackAnalysis: {},
  trackFeatures: {},
  initialTrackProgress: 0,
  volumeQueues: {},
  initialStart: 0,
  trackProgress: 0,
  active: false,
  initialized: false,
  noPlayback: false,
  loadingNextSong: false,
  alwaysShowAlbumArt: false,
  alwaysShowTrackInfo: false,
  albumArtVisible: false,
  trackInfoVisible: false,
  hover: false,
  hoverTimeout: null,
  hoverDelay: 1000,
  spinnerVisible: false,
  hideAll: false,
  menuVisible: false,
  settingsVisible: false,
  toast: {
    visible: false,
    message: '',
    autohide: true
  },
  beatInterval: 'tatums',
  selectedVisualizer: 'fractal',
  trails: initialTrailsState(),
  trailsBackground: initialTrailsBackground()
}