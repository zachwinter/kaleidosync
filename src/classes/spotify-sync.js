const request = require('request')
const Client = require('../models/client.js')

class SpotifySync {
  constructor(auth_id, config) {
    this.auth_id = auth_id
    this.config = config
    this.model = {}
    this.currentlyPlaying = {}
    this.trackAnalysis = {}
    this.trackFeatures = {}
    this.callbackIndex = 0
    this.requestOptions = {}
    this.requestDebounce = 5000

    this.getModel()
  }

  getCurrentlyPlaying() {
    this.requestOptions.url = this.config.spotify.endpoints.currentlyPlaying
    this.callbackIndex = 0

    const getData = (body) => {
      this.currentlyPlaying = body
      this.getTrackData('trackFeatures')
      this.getTrackData('trackAnalysis')
    }

    request.get(this.requestOptions, (err, res, body) => {
      if (err) {
        console.log(err)
        return
      } 

      if (body.is_playing === false) {
        this.model.playing = false
        this.model.save()
        return
      }

      if (this.model.initialized === false) {
        console.log(`${this.model.auth_id} | SpotifySync session initializing.`)
        getData(body)
      }

      else {
        console.log(`${this.model.auth_id} | Current Track | ${body.item.artists[0].name} – ${body.item.name} | ${body.progress_ms} / ${body.item.duration_ms}`)

        if (JSON.stringify(body.item) !== JSON.stringify(this.model.currentlyPlaying.item))
          getData(body)
      }
    })

    setTimeout(() => {
      this.getCurrentlyPlaying()
    }, this.requestDebounce)
  }

  getTrackData(dataType) {
    this.requestOptions.url = this.config.spotify.endpoints[dataType] + '/' + this.currentlyPlaying.item.id

    request.get(this.requestOptions, (err, res, body) => {
      if (err) {
        console.log(err)
      }

      else {      
        this.callbackIndex++

        this.model[dataType] = body

        if (this.callbackIndex === 2) {
          this.model.currentlyPlaying = this.currentlyPlaying
          this.model.initialized = true
          this.model.save()
        }
      }
    })
  }

  getModel() {
    Client.find({ auth_id: this.auth_id }, (err, client) => {
      if (err) {
        console.log(err)
      }

      else {
        this.model = client[0]

        this.requestOptions = {
          headers: { 'Authorization': 'Bearer ' + this.model.access_token },
          json: true 
        }

        this.getCurrentlyPlaying()
      }
    })
  }
}

module.exports = SpotifySync