const express = require('express');
const mongoose = require('mongoose');
// const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
// const usersRouter = require('./routes/users');
// const cardsRouter = require('./routes/cards');
// const { createUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');
// const Custom404Error = require('./errors/Custom404Error');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), login);
// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string().regex(
//       /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
//     ),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), createUser);
// app.use('/users', auth, usersRouter);
// app.use('/cards', auth, cardsRouter);
// app.use(() => {
//   throw new Custom404Error('Запрашиваемый ресурс не найден');
// });
app.get('/', (req, res) => {
  res.send('Запрос выполнен успешно');
});
app.use('/', require('./routes/index'));

app.use(errors());
app.use(handleErrors);
app.listen(PORT, () => {
});
