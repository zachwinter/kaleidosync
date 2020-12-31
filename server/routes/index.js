const authentication = require('./authentication')
const sketches = require('./sketches')

module.exports = app => {
  authentication(app)
  sketches(app)
}