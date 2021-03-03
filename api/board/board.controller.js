const { boardService } = require('./board.service')
const { userService } = require('../user/user.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb')

module.exports = {
  addBoard: async (req, res) => {
    try {
      const {
        body: board,
        decodedToken: { userId }
      } = req
      const boardId = await boardService.add(board)
      await userService.updateBoardUsers(boardId, [userId])
      res.send({ boardId })
    } catch (err) {
      console.error(`boardController - addBoard ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  getBoards: async (req, res) => {
    try {
      const boards = await boardService.query(req.query)
      res.send(boards)
    } catch (err) {
      console.error(`boardController - getBoards ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  getBoard: async (req, res) => {
    try {
      const board = await boardService.getById(req.params._id)
      board.users = await userService.getUsersById(board.users)
      res.send(board)
    } catch (err) {
      console.error(`boardController - getBoard ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  updateBoard: async (req, res) => {
    const board = req.body
    board.users = board.users.map(({ _id }) => _id)
    try {
      const prevBoard = await boardService.update(board)
      await userService.updateBoardUsers(board._id, board.users, prevBoard.users)
      res.end()
    } catch (err) {
      console.error(`boardController - updateBoard ${err}`)
      res.status(500).send(`${err}`)
    }
  },

  deleteBoard: async (req, res) => {
    try {
      await boardService.remove(req.params.id)
      res.end()
    } catch (err) {
      console.error(`boardController - deleteBoard ${err}`)
      res.status(500).send(`${err}`)
    }
  }
}
