const { userService } = require('./user.service')
const logger = require('../../services/logger.service')

module.exports = {
  getUser: async (req, res) => {
    const user = await userService.getById(req.params.id)
    res.send(user)
  },

  getUsers: async (req, res) => {
    const users = await userService.query(req.params)
    res.send(users)
  },

  deleteUser: async (req, res) => {
    await userService.remove(req.params.id)
    res.end()
  },

  updateUser: async (req, res) => {
    const user = await userService.update(req.body)
    res.send(user)
  }
}
