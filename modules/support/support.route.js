const SupportController = require('./support.controller');
const roomRoute = require('./room.route');
const namespaceRoute = require('./namespace.route');

const { StatusCodes } = require('http-status-codes');
const { Router } = require('express');
const { checkLogin, checkAccessLogin } = require('../auth/auth');

const supportRoute = Router();

supportRoute.use('/namespace', namespaceRoute);
supportRoute.use('/room', roomRoute);
supportRoute.get('/login', checkAccessLogin, SupportController.loginForm);
supportRoute.post('/login', checkAccessLogin, SupportController.login);
supportRoute.get('/', checkLogin, SupportController.renderChatRoom);

module.exports = supportRoute;
