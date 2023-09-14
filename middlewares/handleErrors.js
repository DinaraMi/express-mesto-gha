module.exports.handleErrors = (err, req, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ message: `Некорректные данные: ${err.message}` });
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ message: 'Некорректный токен' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).send({ message: 'Истек срок действия токена' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};
