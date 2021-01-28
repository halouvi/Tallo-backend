const logger = require('../services/logger.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  
  requireAuth: (req, res, next) => {
    if (!req.cookies.token) return res.send({ message: `Couldn't login: No JWT present` })
    jwt.verify(
      req.cookies.token,
      process.env.ACCESS_TOKEN_SECRET,
      { algorithms: ['HS256'] },
      (err, decodedToken) => {
        if (err) return res.status(403).send({ message: `Couldn't login: JWT invalid` })
        req.decodedToken = decodedToken
        next()
      }
    )
  },

  requireAdmin: (req, res, next) => {
    req.decodedToken.isAdmin ? next() : res.status(403).end('Unauthorized Enough..')
  }
}
