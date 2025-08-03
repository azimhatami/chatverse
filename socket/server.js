const { Server } = require('socket.io');

function initialSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  return io;
}

module.exports = initialSocket
