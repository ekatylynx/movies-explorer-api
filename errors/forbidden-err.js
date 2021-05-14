class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
// Ошибка 400, когда с запросом что-то не так;
// Неправильно заполненные поля в запросе body

module.exports = ForbiddenError;
