const bcrypt = require('bcrypt')
const { userService } = require('../user/user.service')
const dbService = require('../../services/db.service')
const { makeId } = require('../../services/util.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb')

const saltRounds = 10

var tokens = []

module.exports = {
  authService: {
    login: async ({ email, password }) => {
      logger.debug(`auth.service - login with email: ${email}`)
      if (!email || !password) throw new Error('email and password are required!')
      const user = await userService.getByEmail(email)
      if (!user) return Promise.reject('Invalid email or password')
      const match = await bcrypt.compare(password, user.password)
      delete user.password
      if (!match) return Promise.reject('Invalid email or password')

      const collection = await dbService.getCollection('token')
      const newToken = makeId(10)
      const newHash = await bcrypt.hash(newToken, saltRounds)
      const {
        ops: [{ _id: newTokenId }]
      } = await collection.insertOne({
        hash: newHash,
        createdAt: new Date(),
        userId: ObjectId(user._id).toHexString()
      })
      const login = {
        token: newToken,
        tokenId: ObjectId(newTokenId).toHexString(),
        userId: ObjectId(user._id).toHexString()
      }
      return { user, login }
    },

    tokenLogin: async ({ token, tokenId, userId }) => {
      try {
        const collection = await dbService.getCollection('token')
        const { value } = await collection.findOneAndUpdate(
          { _id: ObjectId(tokenId) },
          { $set: { createdAt: new Date() } }
        )
        console.log(value);
        const match = await bcrypt.compare(token, value.hash)
        if (!match) return Promise.reject('Invalid token')
        const user = await userService.getById(userId)
        return { user, login: { token, tokenId, userId } }
      } catch (error) {
        console.error('ERROR: Could not check token', error)
        throw new Error(error)
      }
    },

    logout: async ({ tokenId }) => {
      try {
        const collection = await dbService.getCollection('token')
        await collection.findOneAndDelete({ _id: ObjectId(tokenId) })
      } catch (error) {
        console.error('ERROR: Could not delete login token', error)
        throw new Error(error)
      }
    },

    signup: async ({ email, password, fullname, imgUrl, boards }) => {
      logger.debug(`auth.service - signup with email: ${email}, name: ${fullname}`)
      if (!email || !password || !fullname)
        return Promise.reject('email, fullname and password are required!')

      const hash = await bcrypt.hash(password, saltRounds)
      return userService.add({ email, password: hash, fullname, imgUrl, boards })
    }
  }
}
