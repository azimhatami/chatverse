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
        socket.emit('roomList', conversation.rooms)
        socket.on('joinRoom', async roomName => {
          const lastRoom = Array.from(socket.rooms)[1];
          if (lastRoom) {
            socket.leave(lastRoom);
            await this.getOnlineUsers(namespace.endpoint, roomName)
          }
          socket.join(roomName);
          await this.getOnlineUsers(namespace.endpoint, roomName)
          const roomInfo = conversation.rooms.find(item => item.name == roomName)
          socket.emit('roomInfo', roomInfo)
          socket.on('disconnect', async () => {
            await this.getOnlineUsers(namespace.endpoint, roomName)
          })
        })
      })
    }
  }

  async getOnlineUsers(endpoint, roomName) {
    const onlineUsers = await this.#io.of(`/${endpoint}`).in(roomName).allSockets();
    this.#io.of(`/${endpoint}`).in(roomName).emit('onlineUsers', Array.from(onlineUsers).length)
  }
}

module.exports = NamespaceHandler;
