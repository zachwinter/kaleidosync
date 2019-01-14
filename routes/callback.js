const express = require('express')
const router = express.Router()
const request = require('request')
const querystring = require('querystring')
const config = require('../config')

router.get('/', (req, res) => {
  const code = req.query.code || null
  
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
      res.cookie(config.access_token, body.access_token)
      res.cookie(config.refresh_token, body.refresh_token)
      res.cookie(config.refresh_code, code)

      res.redirect('http://localhost:8000/#start')
    } else {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }))
    }
  })
})

module.exports = router