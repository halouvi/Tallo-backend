const logger = require('../services/logger.service')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  verifyAccessToken: (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1]
    if (!accessToken) return res.send({ message: `No JWT present` })
    try {
      req.decodedToken = _verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
      next()
    } catch (err) {
      res.status(403).send(err)
    }
  },

  verifyRefreshToken: (req, res, next) => {
    const refreshToken = req.cookies.REFRESH_TOKEN
    if (!refreshToken) return res.status(403).send({ message: 'No Refresh Token' })
    try {
      req.decodedToken = _verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      next()
    } catch (err) {
      res.status(403).send(err)
    }
  },

  requireAdmin: (req, res, next) => {
    req.decodedToken.isAdmin ? next() : res.status(403).end('Unauthorized Enough..')
  }
}

const _verifyToken = (token, secret) => {
  return jwt.verify(token, secret, { algorithms: [process.env.ALGORITHM] }, (err, decodedToken) => {
    if (err) throw new Error('JWT invalid')
    else return decodedToken
  })
}
