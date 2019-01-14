const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const config = require('../config')

router.get('/', (req, res, next) => {
  const auth_id = req.query.auth_id
  const query = querystring.stringify({
    response_type: 'code',
    client_id: config.client_id,
    scope: config.scope,
    redirect_uri: config.redirect_uri,
    state: auth_id
  })

  res.cookie(config.state_key, auth_id)
  res.redirect('https://accounts.spotify.com/authorize?' + query)
})

module.exports = router