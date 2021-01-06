const request = require('request')

module.exports = app => {
  app.get('/api/authentication/refresh', (req, res, next) => {
    const refresh_token = req.query.token

    if (!refresh_token) {
      res.status(400)
      res.send({ success: false, error: 'No token provided.' })
      return
    }

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      form: {
        refresh_token,
        grant_type: 'refresh_token'
      },
      json: true
    }

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token
        res.send({ success: true, access_token })
      } else {
        res.status(401)
        res.send(error)
      }
    })
  })
}