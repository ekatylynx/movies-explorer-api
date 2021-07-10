const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const DuplicateError = require('../errors/duplicate-err');

// Получение всех видео

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: mongoose.Types.ObjectId(req.user._id) })
    .sort({ createdAt: -1 })
    .then((movies) => res.send(movies))
    .catch(next);
};

// Создание нового видео

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;


  Movie.find({ movieId, owner: mongoose.Types.ObjectId(req.user._id) })
    .then((movie) => {
      if (movie.length > 0) {
        throw new DuplicateError('Вы уже сохранили этот фильм');
      } else {
        Movie.create({
          country,
          director,
          duration,
          year,
          description,
          image,
          trailer,
          thumbnail,
          owner: mongoose.Types.ObjectId(req.user._id), // используем req.user
          movieId,
          nameRU,
          nameEN,
        })
          .then((movie) => res.send(movie))
          .catch(next);
      }
    })
    .catch(next);
};

// Удаление видео

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет карточки с таким id');
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }

      movie.remove()
        .then(() => {
          res.send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch(next);
};
