const http = require('http');
const cors = require('cors');
const express = require('express');

const config = require('./configs/config');
const apiRoute = require('./modules/api.route');
const ConnectToMongoDB = require('./configs/mongo.config');


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
    this.#setupRoutes();
  }

  #configureApp() {
    this.#app.use(cors());
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use('/uploads', express.static('public'));
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

  #connectToDB() {
     ConnectToMongoDB.connect();
  }

  #setupRoutes() {
    this.#app.use('/api', apiRoute)
  }
}

module.exports = CreateApplication
