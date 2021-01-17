const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  userService: {
    getUsersById: async users => {
      try {
        const collection = await dbService.getCollection('user')
        return await collection
          .aggregate([
            { $match: { _id: { $in: users.map(user => ObjectId(user._id)) } } },
            { $unset: 'password' }
          ])
          .toArray()
        console.log(`ERROR: while finding users: ${error}`)
      } catch (err) {
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
