const router = require('express').Router();
const auth = require('../middlewares/auth');

// Код для тестирования, после надо удалить!!!!
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роуты авторизации / регистрации, не требующие токена
router.use('/', require('./auth'));

// авторизация
router.use(auth);

// роуты, которым авторизация нужна
router.use('/', require('./user'));
router.use('/', require('./movie'));

module.exports = router;
