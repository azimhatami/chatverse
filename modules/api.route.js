const { StatusCodes } = require('http-status-codes');
const { Router } = require('express');

const apiRoute = Router();

apiRoute.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'Welcome to the API !!!',
    statusCode: StatusCodes.OK,
  })
});

module.exports = apiRoute;
