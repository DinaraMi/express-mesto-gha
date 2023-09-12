const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_CODE = 400;

module.exports.createUser = (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      }
      if (!validator.isEmail(email)) {
        return res.status(ERROR_CODE).send({ message: 'Некорректный формат email' });
      }
      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          })
            .then((user) => {
              const responseData = {
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
                _id: user._id,
              };
              res.send({ data: responseData });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(ERROR_CODE).send({ message: 'Некорректный id пользователя' });
  }
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(new Error(`Произошла ошибка: ${err}`));
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(err);
      } else {
        next(new Error(`Произошла ошибка: ${err}`));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'JsonWebTokenError') {
        next(err);
      } else {
        next(new Error(`Произошла ошибка: ${err}`));
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((userInfo) => {
      if (!userInfo) {
        return res.status(404).send({ message: 'Пользователь с таким id не найден' });
      }
      return res.status(200).send({ data: userInfo });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error(`Некорректные данные: ${err.message}`));
      } else {
        next(new Error(`Произошла ошибка на сервере: ${err}`));
      }
    });
};
