const express = require('express')
const connectDatabase = require('./database/connect')
const applyMiddleware = require('./middleware')
const composeRoutes = require('./routes')
const path = require('path')
const fallback = require('express-history-api-fallback')

;(async () => {
  await connectDatabase()
  const app = express()
  applyMiddleware(app)
  composeRoutes(app)
  if (process.env.NODE_ENV === 'production') {
    const root = path.resolve(__dirname, '../dist')
    app.use(express.static(root))
    app.use(fallback('index.html', { root }))
  }
  app.listen(process.env.PORT || 6868)
})()
