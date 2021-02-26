const User = require('../models/user');
const { NotFound } = require('../errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFound('Нет пользователей!');
      }
      return res.status(200).send(users);
    })
    .catch((err) => next(err));
};

const getUserId = (req, res, next) => User.findOne({ _id: req.params._id })
  .then((user) => {
    if (!user) {
      throw new NotFound('Нет пользователя с таким id!');
    }
    return res.status(200).send(user);
  })
  .catch((err) => next(err));

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id!');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFound('Нет пользователя с таким id!');
      }
    })
    .catch((err) => next(err));
};

const patchAva = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Нет пользователя с таким id!');
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  getUser,
  getUsers,
  getUserId,
  patchUser,
  patchAva,
};
