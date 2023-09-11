const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};
