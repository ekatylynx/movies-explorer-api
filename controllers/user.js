const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-err');

const { JWT_SECRET = 'some-secret-key' } = process.env;

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new DuplicateError('Пользователь с таким email уже существует');
      } else {
        next(err);
      }
    })
    .catch(next);
};

// Авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

// Обновить инфу о нас
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  // Чтобы обновлять одно из значений без null другого
  const objForUpdate = {};
  if (name) objForUpdate.name = name;
  if (email) objForUpdate.email = email;

  User.findByIdAndUpdate(req.user._id, objForUpdate, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.codeName === 'DuplicateKey') {
        throw new DuplicateError('Пользователь с таким email уже существует');
      } else {
        next(err);
        // если нет совпадений в первом кетче идем в след мидлвейр
      }
    })
    .catch(next);
};

// Получение информации о нас
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      res.status(200).send(user);
    })
    .catch(next);
};
