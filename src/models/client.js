const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
  auth_id: String,
  authenticated: Boolean,
  time_requested: Date,
  time_authenticated: Date,
  email: String,
  id: String,
  access_token: String,
  refresh_token: String,
  refresh_code: String,
  currentlyPlaying: Object,
  trackFeatures: Object,
  trackAnalysis: Object,
  initialized: Boolean,
  playing: Boolean,
  lastPing: Date
})

module.exports = mongoose.model('Client', ClientSchema)