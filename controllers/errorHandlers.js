exports.pageNotFound = (req, res, next) => {
  const error = new Error('Not found.');
  error.statusCode = 404;
  next(error);
};

exports.OtherErrors = (error, req, res, next) => {
  res.status(error.statusCode || 500);
  res.json({
    error: {
      message: error.message,
      data: error.data,
    },
  });
};