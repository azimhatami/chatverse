const mongoose = require('mongoose');
const config = require('./config');

class ConnectToMongoDB {
  #MONGO_URL;

  constructor(MONGO_URL) {
    this.MONGO_URL = MONGO_URL;
  }

  async connect() {
    mongoose.connect(this.MONGO_URL);

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    })

    mongoose.connection.on('error', (error) => {
      console.log(`MongoDB connection error: ${error.message}`);
    })

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    })

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    })
  }
}

module.exports = new ConnectToMongoDB(config.MONGO_URL);
