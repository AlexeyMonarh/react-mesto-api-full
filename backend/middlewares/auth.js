const jwt = require('jsonwebtoken');
const { NotFound } = require('../errors');
const { JWT_SECRET } = require('../config/index');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new NotFound('Нет токена!');
  }
  const token = authorization.replace(/^Bearer /, '');
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
  } catch (err) {
    throw new NotFound('Нет токена!');
  }
  next();
};

module.exports = auth;
