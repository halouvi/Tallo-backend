const { boardService } = require('./board.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

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
    const newBoard = req.body
    const board = await boardService.add(newBoard);
    let user = JSON.parse(JSON.stringify(req.session.user));
    user.boards.push(board._id);
    await userService.update(user);
    const userBoards = await boardService.getBoardsById(user.boards);
    const users = await userService.getUsersById(board.users);
    res.send({ board, users, userBoards })
  }
}
