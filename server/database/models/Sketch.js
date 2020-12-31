const mongoose = require('mongoose')

module.exports = mongoose.model('Sketch', new mongoose.Schema({
  name: { type: String, default: 'Untitled' },
  date: { type: Date, default: Date.now },
  shader: { type: String },
  uniforms: [{ type: Object }],
  published: { type: Boolean, default: false },
}))