const userService = require('./user.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
  const user = await userService.getById(req.params.id)
  res.send(user)
}

async function getUsers(req, res) {
  // const users = await userService.getUsersById(req.body)
  const users = await userService.query(req.params)
  logger.debug(users)
  res.send(users)
}

async function deleteUser(req, res) {
  await userService.remove(req.params.id)
  res.end()
}

async function updateUser(req, res) {
  const user = req.body
  await userService.update(user)
  res.send(user)
}

async function unreadBooking(req, res) {
  const user = req.body
  const updatedUser = await userService.unreadBooking(user)
  res.send(updatedUser)
}

async function resetUnreadBookings(req, res) {
  const user = req.body
  const updatedUser = await userService.resetUnreadBookings(user)
  res.send(updatedUser)
}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  unreadBooking,
  resetUnreadBookings,
}
