const config = {
  default: {
    spotify: {
      client_id: 'ddb9b25d4d0e42eaa0e67240e7c61e2b',
      client_secret: '187031ad285245e19deff5e4dbe17bd5',
      redirect_uri: 'http://localhost:8888/callback',
      scope: 'user-read-private user-read-email user-read-playback-state',
      state_key: 'SPOTIFY_VISUALIZER_AUTH_ID',
      endpoints: {
        currentlyPlaying: 'https://api.spotify.com/v1/me/player/currently-playing',
        trackAnalysis: 'https://api.spotify.com/v1/audio-analysis',
        trackFeatures: 'https://api.spotify.com/v1/audio-features'
      }
    }, 

    database: {
      url: 'mongodb://localhost:27017',
      name: 'visualizer'
    }
  },

  production: {
    spotify: {
      client_id: 'ddb9b25d4d0e42eaa0e67240e7c61e2b',
      client_secret: '187031ad285245e19deff5e4dbe17bd5',
      redirect_uri: 'https://kaleidosync.herokuapp.com/callback',
      scope: 'user-read-private user-read-email user-read-playback-state',
      state_key: 'SPOTIFY_VISUALIZER_AUTH_ID',
      endpoints: {
        currentlyPlaying: 'https://api.spotify.com/v1/me/player/currently-playing',
        trackAnalysis: 'https://api.spotify.com/v1/audio-analysis',
        trackFeatures: 'https://api.spotify.com/v1/audio-features'
      }
    },

    database: {
      url: 'ds121456.mlab.com:21456',
      name: 'spotify-visualizer',
      user: 'yooozicman',
      password: 'yozicmankidthing'
    }
  }
}

module.exports = config[process.env.NODE_ENV] || config.default