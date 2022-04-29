const queryString = require('query-string')

module.exports = app => {
  app.get('/api/authentication/login', (req, res) => {
    const auth_id = Math.random().toString(36).slice(5, 11).toUpperCase()
    const query = queryString.stringify({
      response_type: 'code',
      scope: ["playlist-read-collaborative playlist-read-private streaming user-read-playback-state user-read-recently-played user-modify-playback-state"],
      state: auth_id,
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
    })
    res.cookie(process.env.STATE_KEY, auth_id)
    res.redirect('https://accounts.spotify.com/authorize?' + query)
  })
}