const auth = require('./auth')
const callback = require('./callback')
const login = require('./login')
const refresh = require('./refresh')

module.exports = app => {
  auth(app)
  callback(app)
  login(app)
  refresh(app)
}