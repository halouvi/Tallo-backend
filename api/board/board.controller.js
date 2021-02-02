const { boardService } = require('./board.service')
const { userService } = require('../user/user.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb')

module.exports = {
  addBoard: async (req, res) => {
    const board = req.body
    const boardId = await boardService.add(board)
    await userService.update({
      userId: req.decodedToken.userId,
      field: 'boards',
      type: '$push',
      value: boardId
    })
    res.send({ boardId })
  },
  getBoards: async (req, res) => {
    const boards = await boardService.query(req.query)
    res.send(boards)
  },

  getBoard: async (req, res) => {
    const board = await boardService.getById(req.params._id)
    board.users = await userService.getUsersById(board.users)
    res.send(board)
  },
  updateBoard: async (req, res) => {
    const board = req.body
    board.users = board.users.map(({ _id }) => _id)
    try {
      const prevBoard = await boardService.update(board)
      await userService.updateBoardUsers(board._id, prevBoard.users, board.users)
      res.end()
    } catch (error) {
      console.error(`Couldn't update board: ${error}`)
      res.status(500).send(err)
    }
  },

  deleteBoard: async (req, res) => {
    await boardService.remove(req.params.id)
    res.end()
  }
}
