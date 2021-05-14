class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
// Ошибка 401, когда что-то не так при аутентификации или авторизации;
// Если токен не верный, или неправильный лог пас

module.exports = UnauthorizedError;
