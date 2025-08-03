const { Router } = require('express');
const RoomController = require('./room.controller');
const upload = require('../../utils/multer');

const roomRoute = Router();

roomRoute.get('/list', RoomController.getRooms);
roomRoute.post('/add', upload.single('image'), RoomController.addRoom);

module.exports = roomRoute;
