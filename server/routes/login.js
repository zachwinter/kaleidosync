const querystring = require('querystring')

module.exports = app => {
  app.get('/login', (req, res, next) => {
    const auth_id = req.query.auth_id.toUpperCase()
    const query = querystring.stringify({
      response_type: 'code',
      scope: 'user-read-playback-state',
      state: auth_id,
      client_id: process.env.CLIENT_ID || 'YOUR CLIENT_ID HERE',
      redirect_uri: process.env.REDIRECT_URI || 'YOUR REDIRECT_URI HERE',
    })

    res.cookie(process.env.STATE_KEY, auth_id)
    res.redirect('https://accounts.spotify.com/authorize?' + query)
  })
}