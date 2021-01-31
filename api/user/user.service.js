const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  userService: {
    getUsersById: async users => {
      try {
        const collection = await dbService.getCollection('user')
        return await collection
          .find(
            { _id: { $in: users.map(userId => ObjectId(userId)) } },
            { projection: { password: 0, boards: 0 } }
          )
          .toArray()
      } catch (err) {
        console.log(`ERROR: while finding users: ${error}`)
        throw err
      }
    },

    getById: async userId => {
      try {
        const collection = await dbService.getCollection('user')
        return await collection.findOne(
          { _id: ObjectId(userId) },
          { projection: { password: false } }
        )
      } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        throw err
      }
    },

    getByEmail: async email => {
      try {
        const collection = await dbService.getCollection('user')
        return await collection.findOne({ email })
      } catch (err) {
        console.error(`ERROR: while finding user ${email}`)
        throw err
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

    update: async ({ userId, field, type, value }) => {
      try {
        const collection = await dbService.getCollection('user')
        const { value: user } = await collection.findOneAndUpdate(
          { _id: ObjectId(userId) },
          { [type]: { [field]: value } },
          { new: true, projection: { password: false } }
        )
        return user
      } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        throw err
      }
    },

    add: async user => {
      try {
        const collection = await dbService.getCollection('user')
        const { insertedId } = await collection.insertOne(user)
        delete user.password
        user._id = insertedId
        return user
      } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw new Error(err)
      }
    },

    query: async params => {
      try {
        const criteria = _buildCriteria(params)
        const collection = await dbService.getCollection('user')
        return await collection.find(criteria, { projection: { password: 0, boards: 0 } }).toArray()
      } catch (err) {
        console.error('cannot find users')
        // throw err
      }
    }
  }
}

const _buildCriteria = params => {
  const { query } = params
  const criteria = {}
  if (query) {
    if (!criteria.$or) criteria.$or = []
    const regex = new RegExp(query.split(/,|-| /).join('|'), 'i')
    criteria.$or.push({ fullname: regex })
  }
  return criteria
}

// const _buildCriteria = body => {
//   const { query, boardUsers } = body
//   console.log(query)
//   const criteria = { $and: [], $or: [] }
//   if (query) {
//     const regex = new RegExp(query.split(/,|-| /).join('|'), 'i')
//     criteria.$or.push({ fullname: regex })
//   }
//   if (boardUsers.length) {
//     const userIds = boardUsers.map(userId => ObjectId(userId))
//     criteria.$and.push({
//       _id: {
//         $nin: userIds
//       }
//     })
//   }
//   return criteria
// }
