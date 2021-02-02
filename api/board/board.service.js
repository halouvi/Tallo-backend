const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

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
      } catch (error) {
        console.log('ERROR: cannot find boards')
        throw new Error(error)
      }
    },
    remove: async boardId => {
      try {
        const collection = await dbService.getCollection('board')
        return await collection.deleteOne({ _id: ObjectId(boardId) })
      } catch (error) {
        console.log(`ERROR: cannot remove board ${boardId}`)
        throw new Error(error)
      }
    },
    getById: async boardId => {
      try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ _id: ObjectId(boardId) })
        board._id = ObjectId(board._id).toHexString()
        return board
      } catch (error) {
        console.log(`ERROR: cannot get board ${boardId}`)
        throw new Error(error)
      }
    },
    update: async board => {
      board._id = ObjectId(board._id)
      try {
        const collection = await dbService.getCollection('board')
        const { value: prevBoard } = await collection.findOneAndUpdate(
          { _id: board._id },
          { $set: board }
        )
        prevBoard._id = ObjectId(prevBoard._id).toHexString()
        board._id = ObjectId(board._id).toHexString()
        return prevBoard
      } catch (error) {
        console.log(`ERROR: cannot update board ${board._id}`)
        throw new Error(error)
      }
    },
    add: async board => {
      try {
        const collection = await dbService.getCollection('board')
        const { insertedId } = await collection.insertOne(board)
        return insertedId
      } catch (error) {
        console.log(`ERROR: cannot insert board`)
        throw new Error(error)
      }
    },
    getBoardsById: async boardIds => {
      try {
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
        boards.sort(({ _id }) => (_id === boardIds[0] ? -1 : 1))
        return boards
      } catch (err) {
        console.log(`ERROR: while finding boards: ${error}`)
        throw err
      }
    }
  }
}
