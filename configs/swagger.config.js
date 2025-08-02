const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc'); 
const config = require('./config');

const PORT = config.PORT;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real-tim chat application API',
      description: 'API documentation for chat application',
      version: '1.0.0',
      contact: {
        name: 'Azim Hatami',
        email: 'azimhatami.dev@gmail.com'
      },
      // servers: []
    }
  },
  apis: ['./modules/*/*.swagger.js']
};

// Generate swagger specs
const specs = swaggerJsdoc(options);

// Create a route to serve the swagger UI
const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
  console.log(`Swagger documentaion is available at http://localhost:${PORT}/docs`);
};

module.exports = setupSwagger;
