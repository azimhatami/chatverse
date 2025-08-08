const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  token: { type: String, default: '' }

}, {
  timestamps: true
});

module.exports = model('User', userSchema);
