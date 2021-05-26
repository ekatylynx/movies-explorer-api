class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
// Ошибка 403, когда нет прав на удаление

module.exports = ForbiddenError;
