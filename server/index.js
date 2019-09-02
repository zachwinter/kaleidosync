require('dotenv').config()

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fallback = require('express-history-api-fallback')

const compression = require('compression')
const authRouter = require('./routes/auth')
const callbackRouter = require('./routes/callback')
const loginRouter = require('./routes/login')
const refreshRouter = require('./routes/refresh')

const root = path.resolve(__dirname, '../dist')
const port = process.env.PORT || 8001

const app = express()
app.use(bodyParser())
app.use(cookieParser())
app.use(compression())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(root))
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
}

authRouter(app)
callbackRouter(app)
loginRouter(app)
refreshRouter(app)

app.use(fallback('index.html', { root }))

app.listen(port, () => console.log('Listening on port ' + port))
