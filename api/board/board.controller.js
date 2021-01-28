const { boardService } = require('./board.service')
const { userService } = require('../user/user.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb')

module.exports = {
  getBoards: async (req, res) => {
    const boards = await boardService.query(req.query)
    logger.debug(boards)
    res.send(boards)
  },

  getBoard: async (req, res) => {
    const board = await boardService.getById(req.params._id)
    const users = await userService.getUsersById(board.users)
    res.send({ board, users })
  },

  deleteBoard: async (req, res) => {
    await boardService.remove(req.params.id)
    res.end()
  },

  updateBoard: async (req, res) => {
    const board = req.body
    await boardService.update(board)
    res.send(board)
  },

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
  }
}
