const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  boardService: {
    query: async query => {
      const criteria = _buildCriteria(query)
      const collection = await dbService.getCollection('board')
      const boards = await collection.find(criteria).toArray()
      const boardsSorted = _boardsSorter(boards, query)
      const boardsPaged = _boardsPager(boardsSorted, query)
      return { boards: boardsPaged, boardsLength: boardsSorted.length }
    },

    remove: async boardId => {
      const collection = await dbService.getCollection('board')
      return await collection.deleteOne({ _id: ObjectId(boardId) })
    },

    getById: async boardId => {
      const collection = await dbService.getCollection('board')
      const board = await collection.findOne({ _id: ObjectId(boardId) })
      board._id = ObjectId(board._id).toHexString()
      return board
    },

    update: async board => {
      board._id = ObjectId(board._id)
      const collection = await dbService.getCollection('board')
      const { value: prevBoard } = await collection.findOneAndUpdate(
        { _id: board._id },
        { $set: board }
      )
      prevBoard._id = ObjectId(prevBoard._id).toHexString()
      board._id = ObjectId(board._id).toHexString()
      return prevBoard
    },

    add: async board => {
      const collection = await dbService.getCollection('board')
      const { insertedId } = await collection.insertOne(board)
      return ObjectId(insertedId).toHexString()
    },

    getBoardsById: async boardIds => {
      const collection = await dbService.getCollection('board')
      const boards = await collection
        .find(
          { _id: { $in: boardIds.map(board => ObjectId(board)) } },
          {
            projection: {
              title: true,
              lists: {
                $cond: [{ $eq: ['$_id', ObjectId(boardIds[0])] }, '$lists', '$false']
              },
              users: {
                $cond: [{ $eq: ['$_id', ObjectId(boardIds[0])] }, '$users', '$false']
              },
              labels: {
                $cond: [{ $eq: ['$_id', ObjectId(boardIds[0])] }, '$labels', '$false']
              }
            }
          }
        )
        .toArray()
      boards.forEach(board => (board._id = ObjectId(board._id).toHexString()))
      boards.sort(board => (board._id === boardIds[0] ? -1 : 1))
      return boards
    }
  }
}
