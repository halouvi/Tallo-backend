const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

module.exports = {
  authService: {
    login: async ({ email, password }) => {
      logger.debug(`auth.service - login with email: ${email}`)
      if (!email || !password) throw new Error('email and password are required!')

      const user = await userService.getByEmail(email)
      if (!user) return Promise.reject('Invalid email or password')
      const match = await bcrypt.compare(password, user.password)
      if (!match) return Promise.reject('Invalid email or password')

      delete user.password
      return user
    },

    signup: async ({ email, password, name, imgUrl }) => {
      logger.debug(`auth.service - signup with email: ${email}, name: ${name}`)
      if (!email || !password || !name)
        return Promise.reject('email, name and password are required!')

      const hash = await bcrypt.hash(password, saltRounds)
      return userService.add({ email, password: hash, name, imgUrl })
    }
  }
}
