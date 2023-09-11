const express = require('express');
const mongoose = require('mongoose');
const { celebrate } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const validation = require('./middlewares/validation');
const { handleErrors } = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.post('/signin', celebrate(validation.userSchema), login);
app.post('/signup', celebrate(validation.userSchema), createUser);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.use(handleErrors);
app.listen(PORT, () => {
});
