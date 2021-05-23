const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const user = require('../controllers/user');

// возвращает информацию о пользователе (email и имя)

router.get('/users/me', user.getUser);

// обновляет информацию о пользователе (email и имя)

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }),
}), user.updateUser);

module.exports = router; // экспортировали роутер
