const { Router } = require('express');
const NamespaceController = require('./namespace.controller');

const namespaceRoute = Router();

namespaceRoute.get('/list', NamespaceController.getNamespaces);
namespaceRoute.post('/add', NamespaceController.addNamespace);

module.exports = namespaceRoute;
