const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Conflict, Unauthorized } = require('../errors');
const { JWT_SECRET, JWT_TTL } = require('../config/index');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Email уже используется');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(({
      userName, userAbout, userAvatar, userEmail,
    }) => {
      res.send({
        userName, userAbout, userAvatar, userEmail,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Не правильный Email или пароль!');
      }
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            return user;
          }
          throw new Unauthorized('Не правильный Email или пароль!');
        });
    })
    .then(({ _id }) => {
      const token = jwt.sign({ _id }, JWT_SECRET, { expiresIn: JWT_TTL });
      res.set('Set-Cookie', token);
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  login,
  createUser,
};
