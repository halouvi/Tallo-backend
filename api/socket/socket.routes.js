const { boardService } = require('../board/board.service')
const { userService } = require('../user/user.service')

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
        socket.leave(boardId)
        delete socket.boardId
      })

      socket.on(BOARD_UPDATED, async boardId => {
        const board = await boardService.getById(boardId)
        board.users = await userService.getUsersById(board.users)
        socket.to(boardId).emit(BOARD_UPDATED, board)
      })

      socket.on(disconnect, () => {})
    })
  }
}
