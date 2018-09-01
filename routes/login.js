const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const config = require('../config')

router.get('/', function(req, res, next) {
  const auth_id = req.query.auth_id

  res.cookie('SPOTIFY_VISUALIZER_AUTH_ID', auth_id)

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.client_id,
      scope: config.scope,
      redirect_uri: config.redirect_uri,
      state: auth_id
    }))
})

module.exports = router