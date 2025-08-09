const Conversation = require('../modules/support/support.model');
const moment = require('moment-jalaali');

class NamespaceHandler {
  #io;
  constructor(io) {
    this.#io = io;
  }

  initConnection() {
    this.#io.on('connection', async (socket) => {
      console.log('A new client connected');
      const namespaces = await Conversation.find({}, { title: 1, endpoint: 1 }).sort({ _id: -1 });
      socket.emit('namespacesList', namespaces);
    });
  }

  async createNamespacesConnection() {
    const namespaces = await Conversation.find({}, { rooms: 1, endpoint: 1 }).sort({ _id: -1 });
    for (const namespace of namespaces) {
      this.#io.of(`/${namespace.endpoint}`).on('connection', async socket => {
        const conversation = await Conversation.findOne({ endpoint: namespace.endpoint }, { rooms: 1 });
        socket.emit('roomList', conversation.rooms);

        socket.on('newMessage', async (data) => {
          const { message, roomName, endpoint, sender } = data;
          
          await Conversation.updateOne({ endpoint, 'rooms.name': roomName }, {
            $push: {
              'rooms.$.messages': {
                sender,
                message,
                dateTime: Date.now(),
              },
            },
          });
          
          socket.to(roomName).emit('newMessageToClients', data);
        });

        socket.on('joinRoom', async roomName => {
          const currentRooms = Array.from(socket.rooms);
          if (currentRooms.length > 1) {
             socket.leave(currentRooms[1]);
             await this.getOnlineUsers(namespace.endpoint, currentRooms[1]);
          }
          
          socket.join(roomName);
          await this.getOnlineUsers(namespace.endpoint, roomName);

          const roomInfo = conversation.rooms.find(item => item.name == roomName);
          if (roomInfo) {
              socket.emit('roomInfo', roomInfo);
          }
        });

        socket.on('disconnect', () => {
          console.log(`User ${socket.id} disconnected`);
        });
      });
    }
  }

  async getOnlineUsers(endpoint, roomName) {
    const onlineUsers = await this.#io.of(`/${endpoint}`).in(roomName).allSockets();
    this.#io.of(`/${endpoint}`).in(roomName).emit('onlineUsers', onlineUsers.size);
  }
}

module.exports = NamespaceHandler;
