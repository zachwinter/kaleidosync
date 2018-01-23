const path = require('path')
const GetAuthIDController = require('./controllers/get-auth-id-controller')
const VerifyAuthIDController = require('./controllers/verify-auth-id-controller')
const LoginController = require('./controllers/login-controller')
const CallbackController = require('./controllers/callback-controller')
const RefreshTokenController = require('./controllers/refresh-token-controller')
const NowPlayingController = require('./controllers/now-playing-controller')

module.exports = (app, config) => { 
  app.get('/get-auth-id', (req, res) => {
    GetAuthIDController(req, res)
  })

  app.get('/verify-auth-id', (req, res) => {
    VerifyAuthIDController(req, res)
  })

  app.get('/login', (req, res) => {
    LoginController(req, res, config)
  })

  app.get('/callback', (req, res) => {
    CallbackController(req, res, config)
  })

  app.get('/refresh_token', (req, res) => {
    RefreshTokenController(req, res) 
  })

  app.get('/now-playing', (req, res) => {
    let time = Date.now()
    NowPlayingController(req, res, config, time)
  })

  app.get('/access',  (req, res) => {
    res.sendFile(path.join(__dirname, 'www/serve/access.html'))
  })

  app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/serve/success.html'))
  })

  app.get('/visualizer', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/serve/visualizer.html'))
  })

  app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/serve/demo.html'))
  })
}