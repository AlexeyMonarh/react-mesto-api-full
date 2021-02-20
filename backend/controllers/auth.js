const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Conflict, Unauthorized } = require('../errors');
const { JWT_SECRET, JWT_TTL } = require('../config/index');

const registerUser = (req, res, next) => {
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
      res.send({ token });
    })
    .catch(next);
  // const { email, password } = req.body;
  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     }
  //     // const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
  //     // res.send({ token });
  //     return bcrypt.compare(password, user.password);
  //   })
  //   .then((matched) => {
  //     if (!matched) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     }
  //     const token = jwt.sign({ _id: matched._id }, { expiresIn: '7d' });
  //     res.set('Set-Cookie', token);
  //     return res.send({ message: 'Всё верно!' });
  //   })
  //   .catch((err) => {
  //     res
  //       .status(401)
  //       .send({ message: err.message });
  //   });
};

module.exports = {
  login,
  registerUser,
};
