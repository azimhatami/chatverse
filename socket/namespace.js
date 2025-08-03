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
      this.#io.of(`/${namespace.endpoint}`).on('connection', socket => {
        socket.emit('roomList', namespace.rooms)
      })
    }
  }
}

module.exports = NamespaceHandler;
