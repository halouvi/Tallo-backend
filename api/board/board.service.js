const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const { emit } = require('../socket/socket.routes')

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
}

async function query(query) {
  try {
    const criteria = _buildCriteria(query)
    const collection = await dbService.getCollection('board')
    const boards = await collection.find(criteria).toArray()
    const boardsSorted = _boardsSorter(boards, query)
    const boardsPaged = _boardsPager(boardsSorted, query)
    return { boards: boardsPaged, boardsLength: boardsSorted.length }
  } catch (err) {
    console.log('ERROR: cannot find boards')
    throw err
  }
}

async function remove(boardId) {
  const collection = await dbService.getCollection('board')
  try {
    return await collection.deleteOne({ _id: ObjectId(boardId) })
  } catch (err) {
    console.log(`ERROR: cannot remove board ${boardId}`)
    throw err
  }
}

async function getById(boardId) {
  const collection = await dbService.getCollection('board')
  try {
    return await collection.findOne({ _id: ObjectId(boardId) })
  } catch (err) {
    console.log(`ERROR: cannot remove board ${boardId}`)
    throw err
  }
}

async function update(board) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.findOneAndUpdate({ _id: ObjectId(board._id) }, { $set: board })
    emit('updateBoard', board)
    return board
  } catch (err) {
    console.log(`ERROR: cannot update board ${ObjectId(board._id)}`)
    throw err
  }
}

async function add(board) {
  const collection = await dbService.getCollection('board')
  console.log(collection)
  try {
    await collection.insertOne(board)
    return board
  } catch (err) {
    console.log(`ERROR: cannot insert board`)
    throw err
  }
}

function _buildCriteria(query) {
  const criteria = {}
  if (query.txt) {
    if (!criteria.$or) criteria.$or = []
    const regex = new RegExp(query.txt.split(/,|-| /).join('|'), 'i')
    criteria.$or.push({ 'location.city': regex }, { 'location.country': regex })
  }
  if (query.isDone) {
  }
  return criteria
}

function _boardsSorter(boards, { sortBy = 'rating' }) {
  return boards.sort((a, b) => {
    if (sortBy === 'rating') {
      return _ratingAverage(a) <= _ratingAverage(b) ? 1 : -1
    } else return a[sortBy].toString() >= b[sortBy].toString() ? 1 : -1
  })
}

function _boardsPager(boards, { page = 1, limit = 100 }) {
  return boards.filter(
    (board, idx) => idx >= page * limit - limit && idx <= page * limit - 1
  )
}

function _ratingAverage(board) {
  const format = (num, decimals) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  var ratingSum = 0
  if (board.reviews) {
    board.reviews.forEach(review => {
      ratingSum += +review.rating
    })
    return format(ratingSum / board.reviews.length)
  } else return 0
}
