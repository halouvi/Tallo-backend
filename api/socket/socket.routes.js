const chatMap = {}
const { io } = require('../../server')

function emit(type, payload) {
  io.sockets.emit(type, payload)
}

function connectSockets(io) {
  io.on('connection', socket => {
    // io.sockets.emit('update', )
    // socket.on('onChatMsg', msg => {
    //   if (!chatMap[socket.boardId]) chatMap[socket.boardId] = []
    //   chatMap[socket.boardId].push(msg)
    //   io.to(socket.boardId).emit('chatMsg', msg)
    // })
    // socket.on('onUserLogin', userId => {
    //   socket.join(userId)
    //   socket.userId = userId
    // })

    // socket.on('onJoinBoardChat', boardId => {
    //   socket.leave(socket.boardId)
    //   socket.join(boardId)
    //   socket.boardId = boardId
    //   if (chatMap[boardId])
    //   io.to(boardId).emit('chatLoadHistory', chatMap[boardId])
    // })

    // socket.on('onLeaveBoardChat', () => {
    //   socket.leave(socket.boardId)
    //   delete socket.boardId
    // })

    socket.on('disconnect', () => {})
  })
}

function _formatDate(date) {
  return new Date(date).toLocaleDateString('en-us', {
    timeZone: 'utc',
    month: 'short',
    day: 'numeric',
  })
}

module.exports = { connectSockets, emit }
