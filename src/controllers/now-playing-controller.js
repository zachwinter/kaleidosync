const request = require('request')
const querystring = require('querystring')
const Client = require('../models/client.js')
const SpotifySync = require('../classes/spotify-sync')

const NowPlayingController = (req, res, config, time) => {
  let auth_id = req.query.auth_id,
      currentlyPlayingID = req.query.currentlyPlayingID || 0,
      client = {}

  Client.find({ auth_id: auth_id }, (err, clients) => {
    if (err) {
      console.log(err)
    } else {
      let client = clients[0]

      if (!client.initialized) {
        res.send(JSON.stringify({
          initialized: false,
          playing: false
        }))

        return
      }

      if (client.playing === false) {
        res.send(JSON.stringify({
          initialized: true,
          playing: false
        }))

        return
      }

      if (currentlyPlayingID === client.currentlyPlaying.item.id) {
        res.send(JSON.stringify({
          initialized: true,
          playing: true
        }))

        return
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        initialized: true,
        playing: true,
        currentlyPlaying: client.currentlyPlaying,
        trackAnalysis: client.trackAnalysis,
        trackFeatures: client.trackFeatures
      }))
    }
  })
}

module.exports = NowPlayingController