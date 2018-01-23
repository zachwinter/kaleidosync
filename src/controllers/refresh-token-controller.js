const request = require('request')
const querystring = require('querystring')

const RefreshTokenController = (req, res) => {
  let refresh_token = req.query.refresh_token

  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      code: code,
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token
      res.redirect('/visualizer#' + querystring.stringify({ access_token: access_token, refresh_token: refresh_token }))
    } else {
      console.log(error, response)
    }
  })
}

module.exports = RefreshTokenController
