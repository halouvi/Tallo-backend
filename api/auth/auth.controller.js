const { authService } = require('./auth.service')
const logger = require('../../services/logger.service')
const { boardService } = require('../board/board.service')
const { userService } = require('../user/user.service')

const NAME = 'token'
const MAX_AGE = 259200000 // 3 days

module.exports = {
  login: async ({ decodedToken, body }, res) => {
    try {
      var user
      if (decodedToken) {
        user = await userService.getById(decodedToken.userId)
      } else {
        user = await userService.getByEmail(body.email)
        const match = await authService.validatePassword(body.password, user.password)
        delete user.password
        if (!match) throw new Error(`Couldn't login: Invalid email or password`)
      }
      const token = await authService.login(user._id)
      const boards = await boardService.getBoardsById(user.boards)
      const board = boards[0]
      user.boards = boards.map(({ _id, title }) => ({ _id, title }))
      res
        .cookie(NAME, token, {
          maxAge: MAX_AGE,
          httpOnly: true
        })
        .send({ user, board })
      logger.debug(`${user.email} Logged in}`)
    } catch ({ message }) {
      console.error(message)
      logger.error('[LOGIN] ' + message)
      res.status(401).send({ message })
    }
  },

  signup: async (req, res) => {
    try {
      const user = await authService.signup(req.body)
      const token = await authService.login(user._id)
      res
        .cookie(NAME, token, {
          maxAge: MAX_AGE,
          httpOnly: true
        })
        .send({ user })
      logger.debug(`new account created: ${JSON.stringify(req.body.email)}`)
    } catch ({ message }) {
      console.error(message)
      logger.error('[SIGNUP] ' + message)
      res.status(500).send({ message })
    }
  },

  logout: async (req, res) => {
    try {
      // await authService.logout(req.decodedToken)
      res
        .cookie(NAME, null, {
          maxAge: 0,
          httpOnly: true
        })
        .send({ message: 'logged out successfully' })
    } catch ({ message }) {
      console.error({ message })
      logger.error('[LOGOUT] ' + message)
      res.status(500).send({ message: 'could not logout, please try later' })
    }
  }
}
