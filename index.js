const http = require('http');
const path = require('path');
const cors = require('cors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const config = require('./configs/config');
const apiRoute = require('./modules/api.route');
const supportRoute = require('./modules/support/support.route');
const ConnectToMongoDB = require('./configs/mongo.config');
const setupSwagger = require('./configs/swagger.config');


class CreateApplication {
  #app;
  #PORT;
  #MODE;

  constructor(PORT, MODE) {
    this.#app = express();
    this.#PORT = PORT;
    this.#MODE = MODE; 

    this.#configureApp();
    this.#setupServer();
    this.#connectToDB();
    this.#configViewEngin();
    this.#configureSwagger();
    this.#setupRoutes();
  }

  #connectToDB() {
     ConnectToMongoDB.connect();
  }

  #configureApp() {
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static('public'));
  }

  #setupServer() {
    const server = http.createServer(this.#app);

    server.listen(this.#PORT, () => {
      const runningMode = `Server running in ${this.#MODE} mode`;
      const runningOnPort = `on port ${this.#PORT}`;
      const runningSince = `[since ${new Date().toISOString()}]`;

      console.log("Server is starting...");
      console.log(`${runningMode} ${runningOnPort} ${runningSince}`);
      console.log(`Server is running on ${config.APP_URL}${this.#PORT}`);
    }).on('error', () => {
      console.log(`Error starting server: ${error.message}`);
    })
  }

  #configureSwagger() {
    setupSwagger(this.#app);
  }

  #configViewEngin() {
    this.#app.use(expressLayouts);
    this.#app.set('view engine', 'ejs');
    this.#app.set('views', 'resource/views');
    console.log(path.join(__dirname, 'resource/views'));
    this.#app.set('layout extractStyles', true);
    this.#app.set('layout extractScripts', true);
    this.#app.set('layout', './layouts/main');
  }

  #setupRoutes() {
    this.#app.use('/api', apiRoute)
    this.#app.use('/support', supportRoute)
  }
}

module.exports = CreateApplication
