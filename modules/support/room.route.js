const { Router } = require('express');
const RoomController = require('./room.controller');

const roomRoute = Router();

roomRoute.get('/list', RoomController.getRooms);
roomRoute.post('/add', RoomController.addRoom);

module.exports = roomRoute;
