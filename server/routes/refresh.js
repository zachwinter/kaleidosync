const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('../config')

router.get('/', (req, res, next) => {
  const refresh_token = req.query.token

  if (!refresh_token) {
    res.status(400)
    res.send({ ERROR: 'No token provided.' })
    return
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(config.client_id + ':' + config.client_secret).toString('base64')) },
    form: {
      refresh_token,
      grant_type: 'refresh_token'
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({ access_token })
    } else {
      res.send({ what: 'thefuck '})
    }
  })
})

module.exports = router