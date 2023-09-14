const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
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
app.get('/', (req, res) => {
  res.send('Запрос прошел успешно');
});
app.use('/', require('./routes/index'));

app.use(errors());
app.use(handleErrors);
app.listen(PORT, () => {
});
