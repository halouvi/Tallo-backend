const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  boardService: {
    query: async query => {
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
    },

    remove: async boardId => {
      const collection = await dbService.getCollection('board')
      try {
        return await collection.deleteOne({ _id: ObjectId(boardId) })
      } catch (err) {
        console.log(`ERROR: cannot remove board ${boardId}`)
        throw err
      }
    },

    getById: async boardId => {
      try {
        const collection = await dbService.getCollection('board')
        return await collection.findOne({ _id: ObjectId(boardId) })
      } catch (err) {
        console.log(`ERROR: cannot remove board ${boardId}`)
        throw err
      }
    },

    update: async board => {
      board._id = ObjectId(board._id)
      try {
        const collection = await dbService.getCollection('board')
        await collection.findOneAndUpdate({ _id: board._id }, { $set: board })
        return board
      } catch (err) {
        console.log(`ERROR: cannot update board ${ObjectId(board._id)}`)
        throw err
      }
    },
    add: async board => {
      try {
        const collection = await dbService.getCollection('board')
        const addedBoard = await collection.insertOne(board)
        return await collection.findOne({ _id: ObjectId(addedBoard.insertedId) })
      } catch (err) {
        console.log(`ERROR: cannot insert board`)
        throw err
      }
    },
  },
}
