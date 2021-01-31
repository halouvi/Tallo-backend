const express = require('express')
const {
  verifyRefreshToken,
  verifyAccessToken
} = require('../../middlewares/requireAuth.middleware')
const { loginByCreds, loginByToken, signup, refreshTokens, logout } = require('./auth.controller')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', loginByCreds)
router.post('/refresh_token/login', verifyRefreshToken, loginByToken)
router.post('/refresh_token', verifyRefreshToken, refreshTokens)
router.post('/logout', logout)

module.exports = router
