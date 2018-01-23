/** Project dependencies. */
const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const Schema = mongoose.Schema

/** Project configuration. */
const config = require(path.join(__dirname, 'src/config.js'))

/** Database connection. */
if (!process.env.PORT) {
  mongoose.connect(`${config.database.url}/${config.database.name}`, { useMongoClient: true });
} else {
  mongoose.connect(`mongodb://${config.database.user}:${config.database.password}@${config.database.url}/${config.database.name}`, { useMongoClient: true });
}

mongoose.Promise = global.Promise;

/** Express instance. */
let app = express()

/** Initiate middleware. */
app.use(express.static(path.join(__dirname, 'src/www/serve')))
   .use(cookieParser()) 

/** Routes */
require('./src/routes.js')(app, config)

/** Launch server. */
app.listen(process.env.PORT || 8888, () => {
  console.log(`Server listening on port ${process.env.PORT || 8888}`)
})