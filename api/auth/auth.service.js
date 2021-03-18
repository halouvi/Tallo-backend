require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10

module.exports = {
  authService: {
    createTokens: userId => {
      const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: process.env.ALGORITHM,
        expiresIn: +process.env.REFRESH_TOKEN_LIFE
      })
      const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: process.env.ALGORITHM,
        expiresIn: +process.env.ACCESS_TOKEN_LIFE
      })
      return { refreshToken, accessToken }
    },

    validatePassword: async (password, hashedPassword) => {
      return (await bcrypt.compare(password, hashedPassword))
        ? Promise.resolve()
        : Promise.reject('Incorrect Password!')
    },

    hashPassword: password => bcrypt.hash(password, saltRounds)
  }
}
  