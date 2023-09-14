const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const auth = require('../middlewares/auth');
const Custom404Error = require('../errors/Custom404Error');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('', (req, res, next) => {
  next(new Custom404Error('Запрашиваемый ресурс не найден'));
});

module.exports = router;
