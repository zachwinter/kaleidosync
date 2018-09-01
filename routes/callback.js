const express = require('express')
const router = express.Router()
const request = require('request')
const querystring = require('querystring')
const config = require('../config')

router.get('/', (req, res) => {
  const auth_id = req.query.state || null
  const storedState = req.cookies ? req.cookies['SPOTIFY_VISUALIZER_AUTH_ID'] : null
  const code = req.query.code || null

  if (auth_id === null || auth_id !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))

    return
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: config.redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64'))
    },
    json: true
  }
  
  request.post(authOptions, (error, response, body) => {
    if (!error && res.statusCode === 200) {
      res.cookie('KALEIDOSYNC_ACCESS_TOKEN', body.access_token)
      res.cookie('KALEIDOSYNC_REFRESH_TOKEN', body.refresh_token)
      res.cookie('KALEIDOSYNC_REFRESH_CODE', code)

      res.redirect('/visualizer')
    } else {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
    }
  })
})

module.exports = router