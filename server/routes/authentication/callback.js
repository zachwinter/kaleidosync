const request = require('request')

module.exports = app => {
  app.get('/api/authentication/callback', async (req, res) => {
    const code = req.query.code || null
     
    if (code === null) return res.json({ error: true, message: 'No login code present.' })
    
    const config = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization: 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      json: true
    }

    request.post(config, (error, response, { access_token, refresh_token }) => {
      res.cookie(process.env.ACCESS_TOKEN, access_token) 
      res.cookie(process.env.REFRESH_TOKEN, refresh_token)
      res.cookie(process.env.REFRESH_CODE, code)
      if (process.env.NODE_ENV === 'production') {
        res.redirect(process.env.PROJECT_ROOT + '/visualizer')
      } else {
        res.redirect('http://localhost:8080/visualizer')
      }
    })
  })
}