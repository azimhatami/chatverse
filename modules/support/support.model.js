const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema({
  sender: { type: Types.ObjectId, ref: 'user' },
  message: { type: String },
  dateTime: { type: Date, default: Date.now }
});

const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  image: { type: String },
  messages: { type: [messageSchema], default: [] }
});

const conversationSchema = new Schema({
  title: { type: String, required: true },
  endpoint: { type: String, required: true },
  rooms: {type: [roomSchema], default: []}
});

module.exports = model('Conversation', conversationSchema);
