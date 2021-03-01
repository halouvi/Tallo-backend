const logger = require('../services/logger.service')
const jwt = require('jsonwebtoken')

module.exports = {
  verifyAccessToken: (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1]
    try {
      req.decodedToken = _verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
      next()
    } catch (err) {
      console.error(`authMiddleware - verifyAccessToken ${err}`)
      res.status(403).send(`verifyAccessToken ${err}`)
    }
  },

  verifyRefreshToken: (req, res, next) => {
    const refreshToken = req.cookies.REFRESH_TOKEN
    try {
      req.decodedToken = _verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      next()
    } catch (err) {
      console.error(`authMiddleware - verifyRefreshToken ${err}`)
      res.status(403).send(`verifyRefreshToken ${err}`)
    }
  },

  requireAdmin: (req, res, next) => {
    req.decodedToken.isAdmin ? next() : res.status(403).end('Unauthorized Enough..')
  }
}

const _verifyToken = (token, secret) => {
  if (!token) throw new Error('No token sent')
  return jwt.verify(token, secret, { algorithms: [process.env.ALGORITHM] }, (err, decodedToken) => {
    if (err) throw err
    else return decodedToken
  })
}
