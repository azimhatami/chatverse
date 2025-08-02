const Conversation = require('./support.model');
const { StatusCodes } = require('http-status-codes');

class NamespaceController {
  addNamespace = async (req, res, next) => {
    try {
      const { title, endpoint } = req.body;
      await this.findNamespaceWithEndpoint(endpoint);
      const conversation = await Conversation.create({ title, endpoint });

      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'Namespace created successfully'
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        eorror: error.message
      });
    }
  }

  getNamespaces = async (req, res, next) => {
    try {
      const namespaces = await Conversation.find({}, { rooms: 0 });

      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
            namespaces
        }
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        eorror: error.message
      });
    }
  }

  findNamespaceWithEndpoint = async (endpoint) => {
    const conversation = await Conversation.findOne({ endpoint });
    if (conversation) throw new Error('This endpoint is already taken');
  }
}

module.exports = new NamespaceController();
