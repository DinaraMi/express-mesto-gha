const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registrRouter = require('./routes/registr');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
// app.get('/', (req, res) => {
//   res.send('Запрос прошел успешно');
// });
// app.use('/', indexRouter);
app.post('/signin', loginRouter);
app.post('/signup', registrRouter);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(handleErrors);
app.listen(PORT, () => {
});
