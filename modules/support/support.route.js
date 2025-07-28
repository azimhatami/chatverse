const { StatusCodes } = require('http-status-codes');
const { Router } = require('express');
const SupportController = require('./support.controller');

const supportRoute = Router();

supportRoute.get('/', SupportController.renderChatRoom);

module.exports = supportRoute;
