const mongoose = require('mongoose');
const Card = require('../models/card');
const { NotFound, Forbidden } = require('../errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards.length) {
        throw new NotFound('Нет карточек!');
      }
      return res.send(cards);
    })
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params._id, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена!');
      }
      if (String(card.owner) !== String(req.user._id)) {
        throw new Forbidden('Карточка не удалена! Вы ее не создавали!');
      }
      return Card.removeById(card._id)
        .then(() => {
          res.send({ message: 'Карточка удалена!' });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        res.status(400).send({ message: 'Невалидный ID' });
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFound('Лайк не поставлен! На сервере нет такой карточки!');
      }
      return res.send({ data: like });
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        res.status(400).send({ message: 'Невалидный ID' });
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dislike) => {
      if (!dislike) {
        throw new NotFound('Дизлайк не поставлен! На сервере нет такой карточки!');
      }
      return res.send({ data: dislike });
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        res.status(400).send({ message: 'Невалидный ID' });
      }
      next(err);
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
