require('dotenv').config()
const { userService } = require('../user/user.service')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10

module.exports = {
  authService: {
    login: async userId => {
      try {
        const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '259200000', // 3 Days
          algorithm: 'HS256'
        })
        return token
      } catch (error) {
        throw error
      }
    },

    validatePassword: async (password, hashedPassword) => {
      return await bcrypt.compare(password, hashedPassword)
    },

    signup: async body => {
      try {
        if (!body.email || !body.password || !body.fullname) {
          throw new Error('email, fullname and password are required!')
        }
        const hash = await bcrypt.hash(password, saltRounds)
        const user = await userService.add({ ...body, password: hash })
        return user
      } catch (error) {
        throw error
      }
    }
  }
}
