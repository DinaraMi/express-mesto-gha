const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('users/me', getUserInfo);
router.get('users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserId);
router.patch('users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);
router.patch('users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i)
      .required(),
  }),
}), updateAvatar);

module.exports = router;
