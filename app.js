const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});
app.use((req, res, next) => {
  req.user = {
    _id: '64ee4e0b07fd9271f6ce7cb2',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
});
