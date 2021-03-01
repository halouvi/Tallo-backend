const { boardService } = require('../board/board.service')

const connection = 'connection'
const disconnect = 'disconnect'
const JOIN_BOARD = 'JOIN_BOARD'
const BOARD_UPDATED = 'BOARD_UPDATED'
const LEAVE_BOARD = 'LEAVE_BOARD'

module.exports = {
  connectSockets: io => {
    io.on(connection, socket => {
      socket.on(JOIN_BOARD, boardId => {
        socket.leave(socket.boardId)
        socket.join(boardId)
        socket.boardId = boardId
      })

      socket.on(LEAVE_BOARD, boardId => {
        socket.leave(socket.boardId)
        delete socket.boardId
      })

      socket.on(BOARD_UPDATED, async boardId => {
        const board = await boardService.getById(boardId)
        socket.broadcast.emit(BOARD_UPDATED, board)
      })

      socket.on(disconnect, () => {})
    })
  }
}
