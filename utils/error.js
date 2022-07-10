exports.throwError = (errorMessage, statusCode, data) => {
  const error = new Error(errorMessage);
  error.statusCode = statusCode;
  error.data = data;
  throw error;
};
