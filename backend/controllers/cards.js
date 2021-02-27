const Card = require('../models/card');
const { NotFound } = require('../errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards.length) {
        throw new NotFound('Нет карточек!');
      }
      return res.status(200).send(cards);
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
  Card.findByIdAndRemove(req.params._id, { new: true })
    .orFail(() => {
      throw new NotFound('Карточка не найдена!');
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка не найдена!');
    })
    .then((like) => res.status(200).send({ data: like }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Карточка не найдена!');
    })
    .then((dislike) => res.status(200).send({ data: dislike }))
    .catch(next);
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
