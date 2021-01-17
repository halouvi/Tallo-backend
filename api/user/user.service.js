const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  userService: {

    query: async (query) => {
      try {
        const criteria = _buildCriteria(query)
        const collection = await dbService.getCollection('user')
        const users = await collection.find(criteria).toArray()
        users.forEach(user => delete user.password)
        return users 
      } catch (error) {
        console.log('ERROR: cannot find users')
        throw new Error(error)
      }
    },

    getUsersById: async users => {
      try {
        const collection = await dbService.getCollection('user')
        return await collection
          .aggregate([
            { $match: { _id: { $in: users.map(user => ObjectId(user._id)) } } },
            { $unset: 'password' }
          ])
          .toArray()
        } catch (err) {
        console.log(`ERROR: while finding users: ${error}`)
        throw new Error(err)
      }
    },

    getById: async userId => {
      try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
      } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw new Error(err)
      }
    },

    getByEmail: async email => {
      try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ email })
        return user
      } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        throw new Error(err)
      }
    },

    remove: async userId => {
      try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: ObjectId(userId) })
      } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        throw new Error(err)
      }
    },

    update: async (user) => {
      const collection = await dbService.getCollection('user')
      user._id = ObjectId(user._id)
      console.log(user);
      try {
        // await collection.replaceOne({ _id: user._id }, { $set: user })
        await collection.findOneAndUpdate({ _id: user._id }, { $set: user })
        return user
      } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err
      }
    },

    add: async user => {
      try {
        const collection = await dbService.getCollection('user')
        await collection.insertOne(user)
        return user
      } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw new Error(err)
      }
    }
  }
}

function _buildCriteria(query) {
  const criteria = {}
  if (query.q) {
    if (!criteria.$or) criteria.$or = []
    const regex = new RegExp(query.q.split(/,|-| /).join('|'), 'i')
    criteria.$or.push({ 'fullname': regex })
  }
  return criteria
}