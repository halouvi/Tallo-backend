const logger = require('../../services/logger.service')
const { authService } = require('./auth.service')
const { boardService } = require('../board/board.service')
const { userService } = require('../user/user.service')

module.exports = {
  loginByCreds: async ({ body }, res) => {
    try {
      const user = await userService.getByEmail(body.email)
      const match = await authService.validatePassword(body.password, user.password)
      delete user.password
      !match
        ? res.status(403).send({ message: `Couldn't login: Invalid email or password` })
        : _login(user, res)
    } catch (error) {}
  },

  loginByToken: async ({ decodedToken }, res) => {
    try {
      const user = await userService.getById(decodedToken.userId)
      _login(user, res)
    } catch (error) {}
  },

  signup: async ({ body }, res) => {
    try {
      const hash = await authService.signup(body)
      const user = await userService.add({ ...body, password: hash })
      _login(user, res)
    } catch ({ message }) {
      console.error(message)
      res.status(500).send({ message })
    }
  },

  refreshTokens: async (req, res) => {
    const { refreshToken, accessToken } = await authService.createTokens(req.decodedToken.userId)
    res.cookie(..._createCookie(refreshToken))
    res.send({ accessToken })
  },

  logout: async (req, res) => {
    try {
      // await authService.logout(req.decodedToken)
      res.cookie(..._deleteCookie())
      res.send({ accessToken: null })
    } catch (err) {
      console.error(err)
      logger.error('[LOGOUT] ' + message)
      res.status(500).send({ message: 'could not logout, please try later' })
    }
  }
}

const _login = async (user, res) => {
  try {
    const { refreshToken, accessToken } = await authService.createTokens(user._id)
    const boards = await boardService.getBoardsById(user.boards)
    const board = boards[0]
    user.boards = boards.map(({ _id, title }) => ({ _id, title }))
    board.users = await userService.getUsersById(board.users)
    console.log(board.users)
    logger.debug(`${user.email} Logged in}`)
    res.cookie(..._createCookie(refreshToken)).send({ user, board, accessToken })
  } catch (err) {
    console.error(err)
    logger.error('[LOGIN] ' + message)
    res.status(401).send(err)
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
