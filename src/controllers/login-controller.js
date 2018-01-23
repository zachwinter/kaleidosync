const querystring = require('querystring')

const LoginController = (req, res, config) => {
  let auth_id = req.query.auth_id

  res.cookie(config.spotify.state_key, auth_id)

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.spotify.client_id,
      scope: config.spotify.scope,
      redirect_uri: config.spotify.redirect_uri,
      state: auth_id
    }))
}

module.exports = LoginController