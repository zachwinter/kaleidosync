const config = {
  default: {
    client_id: 'ddb9b25d4d0e42eaa0e67240e7c61e2b',
    client_secret: '187031ad285245e19deff5e4dbe17bd5',
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'user-read-private user-read-email user-read-playback-state',
    state_key: 'SPOTIFY_VISUALIZER_AUTH_ID'
  },

  production: {
    client_id: 'ddb9b25d4d0e42eaa0e67240e7c61e2b',
    client_secret: '187031ad285245e19deff5e4dbe17bd5',
    redirect_uri: 'https://kaleidosync.herokuapp.com/callback',
    scope: 'user-read-private user-read-email user-read-playback-state',
    state_key: 'SPOTIFY_VISUALIZER_AUTH_ID'
  }
}

module.exports = config[process.env.NODE_ENV] || config.default