const Conversation = require('./support.model');
const { StatusCodes } = require('http-status-codes');

class NamespaceController {
  async addNamespace(req, res, next) {
    try {
      const { title, endpoint } = req.body;
      const conversation = await Conversation.create({ title, endpoint });
      res.status(StatusCodes.CREATED).json({
        message: 'Namespace created successful'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async getNamespaces(req, res, next) {
    try {
      const namespaces = await Conversation.find({ }, {rooms: 0});
      res.status(StatusCode.OK).json({
        message: 'Get all namespaces',
        namespaces
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new NamespaceController();
