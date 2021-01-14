const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  getUsersById,
  getById,
  getByEmail,
  remove,
  update,
  add,
  query
}

async function query(query) {
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
}

async function getUsersById(users) {
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
    throw err
  }
}

async function getById(userId) {
  const collection = await dbService.getCollection('user')
  try {
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password
    return user
  } catch (err) {
    console.log(`ERROR: while finding user ${userId}`)
    throw err
  }
}
async function getByEmail(email) {
  const collection = await dbService.getCollection('user')
  try {
    const user = await collection.findOne({ email })
    return user
  } catch (err) {
    console.log(`ERROR: while finding user ${email}`)
    throw err
  }
}

async function remove(userId) {
  const collection = await dbService.getCollection('user')
  try {
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    console.log(`ERROR: cannot remove user ${userId}`)
    throw err
  }
}

async function update(user) {
  const collection = await dbService.getCollection('user')
  user._id = ObjectId(user._id)
  try {
    await collection.replaceOne({ _id: user._id }, { $set: user })
    return user
  } catch (err) {
    console.log(`ERROR: cannot update user ${user._id}`)
    throw err
  }
}

async function add(user) {
  const collection = await dbService.getCollection('user')
  try {
    await collection.insertOne(user)
    return user
  } catch (err) {
    console.log(`ERROR: cannot insert user`)
    throw err
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
