const Client = require('../models/client.js')

const VerifyAuthIDController = (req, res) => {
  let auth_id = req.query.auth_id

  res.setHeader('Content-Type', 'application/json');

  Client.find({ auth_id: auth_id }, (err, client) => {
    if (client.length === 0 || err) {
      res.send(JSON.stringify({ auth_id: auth_id, valid: false }))
    } else {
      res.send(JSON.stringify({ auth_id: auth_id, valid: true }))
    }
  })
}

module.exports = VerifyAuthIDController