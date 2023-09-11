const mongoose = require('mongoose');
const Card = require('../models/card');

const ERROR_CODE = 400;
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(ERROR_CODE).send({ message: 'Некорректный id карточки' });
  }
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (card.owner.toString() !== userId) {
        return res.status(403).send({ message: 'У вас нет прав для удаления этой карточки' });
      }
      return Card.findByIdAndRemove(cardId)
        .then((deletedCard) => {
          if (!deletedCard) {
            return res.status(404).send({ message: 'Карточка не найдена' });
          }
          return res.send({ data: deletedCard });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(ERROR_CODE).send({ message: 'Некорректный id карточки' });
  }
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(ERROR_CODE).send({ message: 'Некорректный id карточки' });
  }
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(next);
};
