// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFound } = require('../errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка!' }));
};

const getUser = (req, res, next) => User.findOne({ _id: req.params._id })
  .then((user) => {
    if (!user) {
      throw new NotFound('Нет пользователя с таким id!');
    }
    res.status(200).send(user);
  })
  .catch((err) => next(err));

const patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .orFail(() => {
      throw new Error('404');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Пользователь не найден!' });
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Информация не обновлена! Ошибка данных!' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

const patchAva = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new Error('404');
    })
    .then((ava) => res.status(200).send({ data: ava }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Пользователь не найден!' });
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Информация не обновлена! Ошибка данных!' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports = {
  // login,
  getUsers,
  getUser,
  // registerUser,
  patchUser,
  patchAva,
};
