const mongoose = require('mongoose');
const validator = require('validator');

const { ObjectId } = mongoose.Types.ObjectId;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'Не валидный Url!',
    },
  },
  owner: {
    ref: 'user',
    type: ObjectId,
    required: true,
  },
  likes: [{
    ref: 'user',
    type: ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
