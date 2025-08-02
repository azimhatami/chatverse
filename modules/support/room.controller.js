const Conversation = require('./support.model');
const { StatusCodes } = require('http-status-codes');

class RoomController {
  addRoom = async (req, res, next) => {
    try {
      const { name, description, image, namespace  } = req.body;
      await this.findNamespaceWithEndpoint(namespace);
      await this.findRoomWithName(name);
      const room = { name, description, image }
      await Conversation.updateOne({endpoint: namespace}, {
        $push: {rooms: room}
      });
      res.status(StatusCodes.CREATED).json({
        message: 'Room created successful'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  getRooms = async (req, res, next) => {
    try {
      const conversation = await Conversation.find({ }, {rooms: 1, _id: 0});
      const allRooms = conversation.flatMap(conv => conv.rooms);
      res.status(StatusCodes.OK).json({
        message: 'Get all namespaces',
        data: allRooms
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  findRoomWithName = async (name) => {
    const room = await Conversation.findOne({ 'rooms.name': name });
    if (room) throw new Error('A room with this name already exists')
  }

  findNamespaceWithEndpoint = async (endpoint) => {
    const namespace = await Conversation.findOne({endpoint});
    if (!namespace) throw new Error('Namespace not found')
    return namespace;
  }
}

module.exports = new RoomController();
