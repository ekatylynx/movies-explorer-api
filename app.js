const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const myErrors = require('./middlewares/errors');

// Слушаем 3000 порт
const { PORT = 3001, DB_PTH = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

// подключаемся к серверу mongo
mongoose.connect(`${DB_PTH}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(requestLogger);

// Ограничение количества запросов в единицу времени
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(limiter);

// Секурити заголовки
app.use(helmet());

// Выносим роуты не требующие авторизации в корневой файл app.js,
// т.к все остальные роуты находящиеся в routes user / card будут доступны только при auth

app.use('/', require('./routes'));

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger); // подключаем логгер ошибок

// здесь обрабатываем все ошибки
app.use(errors());

app.use(myErrors);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
