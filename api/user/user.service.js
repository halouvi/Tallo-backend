const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  userService: {
    getUsersById: async users => {
      const collection = await dbService.getCollection('user')
      return await collection
        .find(
          { _id: { $in: users.map(userId => ObjectId(userId)) } },
          { projection: { password: 0, boards: 0 } }
        )
        .toArray()
    },

    getById: async userId => {
      const collection = await dbService.getCollection('user')
      return await collection.findOne(
        { _id: ObjectId(userId) },
        { projection: { password: false } }
      )
    },

    getByEmail: async email => {
      const collection = await dbService.getCollection('user')
      return await collection.findOne({ email })
    },

    remove: async userId => {
      const collection = await dbService.getCollection('user')
      await collection.deleteOne({ _id: ObjectId(userId) })
    },

    update: async user => {
      const collection = await dbService.getCollection('user')
      const { value: returnedUser } = await collection.findOneAndUpdate(
        { _id: ObjectId(user._id) },
        { $set: user }
      )
      return returnedUser
    },

    updateBoardUsers: async (boardId, nextUsers = [], prevUsers = []) => {
      const removeBoardFrom = prevUsers.filter(user => !nextUsers.includes(user))
      const addBoardTo = nextUsers.filter(user => !prevUsers.includes(user))
      const collection = await dbService.getCollection('user')
      if (removeBoardFrom.length) {
        await collection.updateMany(
          { _id: { $in: removeBoardFrom.map(userId => ObjectId(userId)) } },
          { $pull: { boards: boardId } }
        )
      }
      if (addBoardTo.length) {
        await collection.updateMany(
          { _id: { $in: addBoardTo.map(userId => ObjectId(userId)) } },
          { $push: { boards: { $each: [boardId], $position: 0 } } }
        )
      }
      return { removeBoardFrom, addBoardTo }
    },

    add: async user => {
      const collection = await dbService.getCollection('user')
      const { insertedId } = await collection.insertOne(user)
      delete user.password
      user._id = insertedId
      return user
    },

    query: async params => {
      const $regex = new RegExp(params.query, 'i')
      const collection = await dbService.getCollection('user')
      return await collection.find({ name: { $regex } }).toArray()
    }
  }
}

// const criteria = _buildCriteria(params)
// async function createIndex() {
//   // const criteria = _buildCriteria(params)
//   try {
//     const collection = await dbService.getCollection('user')
//     const res = await collection.createIndex(
//       { name: 1 },
//       {
//         collation: {
//           locale: 'en',
//           strength: 2
//         }
//       }
//     )
//     console.log(res)
//   } catch (error) {}
// }

// createIndex()

const _buildCriteria = params => {
  const { query } = params
  const criteria = {}
  if (query) {
    if (!criteria.$or) criteria.$or = []
    const regex = new RegExp(query.split(/,|-| /).join('|'), 'i')
    criteria.$or.push({ fullname: regex }, { email: regex })
  }
  return criteria
}
