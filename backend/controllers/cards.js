// const mongoose = require('mongoose');
const Card = require('../models/card');
const { NotFound, BadRequest } = require('../errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFound('Нет карточек!');
      }
      res.status(200).send(cards);
    })
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    // eslint-disable-next-line no-shadow
    .then(({ name, link, owner }) => {
      if (link) {
        throw new BadRequest('Карточка не созданна! Ошибка данных');
      }
      return res.send({ name, link, owner });
    })
    .catch(next);
  // (err) => {

  //   return res.status(500).send({ message: 'На сервере произошла ошибка!' });
  // },
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    // .orFail(() => {
    //   throw new Error('404');
    // })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена!');
      }
      res.status(200).send(card);
    })
    .catch(next);
  //   (err) => {
  //   if (err.message === '404') {
  //     return res.status(404).send({ message: 'Карточка не найдена!' });
  //   }
  //   if (err instanceof mongoose.CastError) {
  //     return res.status(400).send({ message: 'Переданы некорректные данные!' });
  //   }
  //   return res.status(500).send({ message: 'На сервере произошла ошибка!' });
  // });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('404');
    })
    .then((like) => res.status(200).send({ data: like }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена!' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Лайк не поставлен! Ошибка данных' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('404');
    })
    .then((dislike) => res.status(200).send({ data: dislike }))
    .catch((err) => {
      if (err.message === '404') {
        return res.status(404).send({ message: 'Карточка не найдена!' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Лайк не убран! Ошибка данных' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
