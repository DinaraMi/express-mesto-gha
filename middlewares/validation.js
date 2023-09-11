const { Joi } = require('celebrate');

const userSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};
const updateProfileSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
};
const updateAvatarSchema = {
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
};
const cardSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
};

module.exports = {
  userSchema,
  updateProfileSchema,
  updateAvatarSchema,
  cardSchema,
};
