const logger = require('../../services/logger.service')
const { authService } = require('./auth.service')
const { boardService } = require('../board/board.service')
const { userService } = require('../user/user.service')

module.exports = {
  loginByCreds: async ({ body }, res) => {
    try {
      const user = await userService.getByEmail(body.email)
      if (!user) throw new Error(`${email} is not registered to any user`)
      await authService.validatePassword(body.password, user.password)
      delete user.password
      _login(user, res)
    } catch (err) {
      console.error(`authController - loginByCreds ${err}`)
      res.status(403).send(`${err}`)
    }
  },

  loginByToken: async ({ decodedToken }, res) => {
    try {
      const user = await userService.getById(decodedToken.userId)
      _login(user, res)
    } catch (err) {
      console.error(`authController - loginByToken ${err}`)
      res.status(403).send(`${err}`)
    }
  },

  signup: async ({ body }, res) => {
    try {
      const hash = await authService.hashPassword(body.password)
      const user = await userService.add({ ...body, password: hash })
      const { refreshToken, accessToken } = authService.createTokens(user._id)
      res.cookie(..._createCookie(refreshToken)).send({ user, accessToken })
    } catch (err) {
      console.error(`authController - signup ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  logout: async (req, res) => {
    try {
      res.cookie(..._deleteCookie()).send({ accessToken: null })
    } catch (err) {
      console.error(`authController - logout ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  refreshTokens: ({ decodedToken }, res) => {
    const { refreshToken, accessToken } = authService.createTokens(decodedToken.userId)
    res.cookie(..._createCookie(refreshToken)).send({ accessToken })
  }
}

const _login = async (user, res) => {
  try {
    const { refreshToken, accessToken } = authService.createTokens(user._id)
    const boards = await boardService.getBoardsById(user.boards)
    user.boards = boards.map(({ _id, title }) => ({ _id, title }))
    const board = boards[0]
    board.users = await userService.getUsersById(board.users)
    logger.debug(`${user.email} Logged in}`)
    res.cookie(..._createCookie(refreshToken)).send({ user, board, accessToken })
  } catch (err) {
    console.error(`authController - _login ${err}`)
    res.status(401).send(`${err}`)
  }
}

const _createCookie = refreshToken => [
  process.env.REFRESH_TOKEN,
  refreshToken,
  {
    maxAge: +process.env.REFRESH_TOKEN_LIFE,
    path: process.env.REFRESH_PATH,
    httpOnly: true
  }
]

const _deleteCookie = () => [
  process.env.REFRESH_TOKEN,
  null,
  {
    maxAge: 0,
    path: process.env.REFRESH_PATH,
    httpOnly: true
  }
]
