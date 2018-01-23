const request = require('request')
const querystring = require('querystring')
const Client = require('../models/client.js')
const SpotifySync = require('../classes/spotify-sync')

const CallbackController = (req, res, config) => {
  let auth_id = req.query.state || null
  let storedState = req.cookies ? req.cookies[config.spotify.state_key] : null
  let code = req.query.code || null

  if (auth_id === null || auth_id !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))

    return
  }

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: config.spotify.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(config.spotify.client_id + ':' + config.spotify.client_secret).toString('base64'))
    },
    json: true
  }
  
  request.post(authOptions, (error, response, body) => {
    if (!error && res.statusCode === 200) {
      Client.find({ auth_id: auth_id }, (error, clients) => {
        let client = clients[0]

        client.authenticated = true
        client.time_authenticated = Date.now()
        client.access_token = body.access_token
        client.refresh_token = body.refresh_token
        client.refresh_code = code
        client.initialized = false

        client.save((error) => {
          if (error) {
            console.log(error)
          } else {
            //let sync = new SpotifySync(auth_id, config)

            res.cookie('KALEIDOSYNC_ACCESS_TOKEN', body.access_token)
            res.cookie('KALEIDOSYNC_REFRESH_TOKEN', body.refresh_token)
            res.cookie('KALEIDOSYNC_REFRESH_CODE', code)

            res.redirect('/visualizer')
          }
        })
      })
    }

    else {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
    }
  })
}

module.exports = CallbackController