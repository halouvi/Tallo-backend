require('dotenv').config()
const { userService } = require('../user/user.service')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10

module.exports = {
  authService: {
    createTokens: async userId => {
      const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: process.env.ALGORITHM,
        expiresIn: +process.env.REFRESH_TOKEN_LIFE
      })
      const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: process.env.ALGORITHM,
        expiresIn: +process.env.ACCESS_TOKEN_LIFE,
      })
      return { refreshToken, accessToken }
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
        return hash
      } catch (error) {
        throw error
      }
    }
  }
}
