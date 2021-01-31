const express = require('express')
const bodyParser = require('body-parser')
const queryType = require('query-types')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

// Express App Config
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: true }))
app.use(queryType.middleware())

process.env.NODE_ENV === 'production'
  ? app.use(express.static(path.resolve(__dirname, 'public')))
  : app.use(
      cors({
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://192.168.1.2:8080'],
        credentials: true
      })
    )

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const boardRoutes = require('./api/board/board.routes')
const { connectSockets } = require('./api/socket/socket.routes')

// routes

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
connectSockets(io)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
  logger.info('Server is running on port: ' + port)
})
