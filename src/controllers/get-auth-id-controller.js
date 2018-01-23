const Client = require('../models/client.js')

const GetAuthIDController = (req, res) => {
  let auth_id = Math.random().toString(36).slice(5, 11)
  let client  = new Client({
    auth_id: auth_id,
    time_requested: Date.now(),
    authenticated: false
  })

  client.save()

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify({ auth_id: auth_id }))
}

module.exports = GetAuthIDController