const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// Получение всех видео

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id, // используем req.user
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

// Удаление видео

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет карточки с таким id');
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }

      Movie.findByIdAndDelete(movie._id)
        .then((data) => {
          res.send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    })
    .catch(next);
};
