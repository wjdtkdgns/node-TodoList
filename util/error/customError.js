class customError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${code}`.startsWith("4") ? "fail" : "error";
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = customError;
