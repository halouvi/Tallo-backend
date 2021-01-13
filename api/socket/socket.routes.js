const chatMap = {}
const { io } = require('../../server')
const { boardService } = require('../board/board.service')

const emit = (type, payload) => {
  io.sockets.emit(type, payload)
}

const connection = 'connection'
const disconnect = 'disconnect'
const JOIN_BOARD = 'JOIN_BOARD'
const BOARD_UPDATED = 'BOARD_UPDATED'
const LEAVE_BOARD = 'LEAVE_BOARD'

const connectSockets = io => {
  io.on(connection, socket => {
    socket.on(JOIN_BOARD, boardId => {
      socket.leave(socket.boardId)
      socket.join(boardId)
      socket.boardId = boardId
    })
    socket.on(BOARD_UPDATED, async (boardId) => {
      const board = await boardService.getById(boardId)
      socket.broadcast.emit(BOARD_UPDATED, board)
    })

    socket.on(LEAVE_BOARD, () => {
      socket.leave(socket.boardId)
      delete socket.boardId
    })

    socket.on(disconnect, () => {})
  })
}

// function _formatDate(date) {
//   return new Date(date).toLocaleDateString('en-us', {
//     timeZone: 'utc',
//     month: 'short',
//     day: 'numeric',
//   })
// }

module.exports = { connectSockets, emit, BOARD_UPDATED }
