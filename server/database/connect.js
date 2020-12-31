require('dotenv').config()
const mongoose = require('mongoose')

module.exports = () => {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })

  return new Promise(resolve => {
    mongoose.connection.once('open', resolve)
  })
}