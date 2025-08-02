const SupportController = require('./support.controller');
const roomRoute = require('./room.route');
const namespaceRoute = require('./namespace.route');

const { StatusCodes } = require('http-status-codes');
const { Router } = require('express');

const supportRoute = Router();

supportRoute.use('/namespace', namespaceRoute);
supportRoute.use('/room', roomRoute);
supportRoute.get('/', SupportController.renderChatRoom);

module.exports = supportRoute;
