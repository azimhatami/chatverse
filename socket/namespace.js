const Conversation = require('../modules/support/support.model');

class NamespaceHandler{
  #io;
  constructor(io) {
    this.#io = io;
  }

  initConnection() {
    this.#io.on('connection', async (socket) => {
      console.log('A new client connected');
      const namespaces = await Conversation.find({}, {title: 1, endpoint: 1}).sort({_id: -1})
      socket.emit('namespacesList', namespaces)
    })
  }

  async createNamespacesConnection() {
    const namespaces = await Conversation.find({}, {title: 1, endpoint: 1, rooms: 1}).sort({_id: -1})
    for (const namespace of namespaces) {
      this.#io.of(`/${namespace.endpoint}`).on('connection', async socket => {
        const conversation = await Conversation.findOne({endpoint: namespace.endpoint}, {rooms: 1}).sort({_id: -1})
        socket.on('joinRoom', roomName => {
          const lastRoom = Array.from(socket.rooms)[1];
          if (lastRoom) {
            socket.leave(lastRoom);
          }
          socket.join(roomName);
          const roomInfo = conversation.rooms.find(item => item.name == roomName)
          socket.emit('roomInfo', roomInfo)
        })
        socket.emit('roomList', conversation.rooms)
      })
    }
  }
}

module.exports = NamespaceHandler;
