const express = require('express')
const serveStatic = require('serve-static')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 8001

const authRouter = require('./routes/auth')
const callbackRouter = require('./routes/callback')
const loginRouter = require('./routes/login')
const refreshRouter = require('./routes/refresh')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(serveStatic(__dirname + '/dist'))
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/callback', callbackRouter)
app.use('/login', loginRouter)
app.use('/refresh', refreshRouter)

app.listen(port, () => console.log('Listening on port ' + port))