const mongoose = require('mongoose');
const User = require('../models/user');
const { NotFound } = require('../errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFound('Нет пользователей!');
      }
      return res.send(users);
    })
    .catch(next);
};

const getUserId = (req, res, next) => User.findById(req.params._id)
  .then((user) => {
    if (!user) {
      throw new NotFound('Нет пользователя с таким id!');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err instanceof mongoose.CastError) {
      res.status(400).send({ message: 'Невалидный ID' });
    }
    next(err);
  });

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id!');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFound('Нет пользователя с таким id!');
    })
    .catch(next);
};

const patchAva = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id!');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  getUserId,
  patchUser,
  patchAva,
};
