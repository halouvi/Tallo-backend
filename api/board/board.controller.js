const boardService = require('./board.service')
const logger = require('../../services/logger.service')

module.exports = {
  getBoards,
  getBoard,
  checkBoards,
  performBoard,
  deleteBoard,
  updateBoard,
  addBoard,
}

async function getBoards(req, res) {
  const boards = await boardService.query(req.query)
  logger.debug(boards)
  res.send(boards)
}

async function getBoard(req, res) {
  const board = await boardService.getById(req.params._id)
  res.send(board)
}

async function checkBoards(req, res) {
  await boardService.checkBoards()
  res.end()
}
async function performBoard(req, res) {
  try {
    const board = await boardService.performBoard(req.params._id)
    await boardService.update(board)
    res.send(board)
  } catch(error) {
    console.log(error);
  }
}

async function deleteBoard(req, res) {
  await boardService.remove(req.params.id)
  res.end()
}

async function updateBoard(req, res) {
  const board = req.body
  await boardService.update(board)
  res.send(board)
}

async function addBoard(req, res) {
  const board = req.body
  // console.log(board);
  await boardService.add(board)
  res.send(board)
}


