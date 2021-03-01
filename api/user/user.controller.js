const { userService } = require('./user.service')
const logger = require('../../services/logger.service')

module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await userService.getById(req.params.id)
      res.send(user)
    } catch (err) {
      console.error(`userController - getUser ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  query: async (req, res) => {
    try {
      const users = await userService.query(req.params)
      res.send(users)
    } catch (err) {
      console.error(`userController - query ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  validateEmail: async (req, res) => {
    try {
      const user = await userService.getByEmail(req.params.email)
      res.send(user ? false : true)
    } catch (err) {
      console.error(`userController - query ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  deleteUser: async (req, res) => {
    try {
      await userService.remove(req.params.id)
      res.end()
    } catch (err) {
      console.error(`userController - deleteUser ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await userService.update(req.body)
      res.send(user)
    } catch (err) {
      console.error(`userController - updateUser ${err}`)
      res.status(500).send(`${err}`)
    }
  }
}
