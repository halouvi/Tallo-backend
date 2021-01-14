const { userService } = require('./user.service')
const logger = require('../../services/logger.service')

module.exports = {
  getUser: async (req, res) => {
    const user = await userService.getById(req.params.id)
    res.send(user)
  },

  getUsers: async (req, res) => {
    console.log('sss', req.params)
    const users = await userService.getUsersById(req.body)
    logger.debug(users)
    res.send(users)
  },

  deleteUser: async (req, res) => {
    await userService.remove(req.params.id)
    res.end()
  },

  updateUser: async (req, res) => {
    const user = req.body
    await userService.update(user)
    res.send(user)
  },

  unreadBooking: async (req, res) => {
    const user = req.body
    const updatedUser = await userService.unreadBooking(user)
    res.send(updatedUser)
  },

  resetUnreadBookings: async (req, res) => {
    const user = req.body
    const updatedUser = await userService.resetUnreadBookings(user)
    res.send(updatedUser)
  }
}
