const { authService } = require('./auth.service')
const logger = require('../../services/logger.service')
const { boardService } = require('../board/board.service')

module.exports = {
  login: async (req, res) => {
    try {
      const { user, login } =
        req.body.email || req.body.password
          ? await authService.login(req.body)
          : req.cookies.login
          ? await authService.tokenLogin(req.cookies.login)
          : {}
      if (!user || !login) throw new Error('ERROR: No credentials sent')
      req.session.user = user
      res.cookie('login', login, {
        maxAge: 259200000, // 3 days
        httpOnly: true
      })
      const userBoards = await boardService.getBoardsById(user.boards)
      res.send({ user, userBoards })
    } catch (error) {
      res.status(401).send({ error })
    }
  },

  signup: async (req, res) => {
    try {
      const { email, password, fullname, imgUrl, boards } = req.body
      logger.debug(email + ', ' + fullname + ', ' + password + ',' + imgUrl + ',' + boards)
      const account = await authService.signup(req.body)
      logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
      const user = await authService.login(req.body)
      req.session.user = user
      res.json(user)
    } catch (err) {
      logger.error('[SIGNUP] ' + err)
      res.status(500).send({ error: 'could not signup, please try later' })
    }
  },

  logout: async (req, res) => {
    try {
      req.session.destroy()
      await authService.logout(req.cookies.login)
      res.cookie('login', null, {
        maxAge: 0,
        httpOnly: true
      })
      res.send({ message: 'logged out successfully' })
    } catch (error) {
      res.status(500).send({ error })
    }
  }
}
