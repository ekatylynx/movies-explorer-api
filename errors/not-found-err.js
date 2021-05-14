class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

// Ошибка 404, например, когда мы не нашли ресурс по переданному _id;

module.exports = NotFoundError;
