const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ message });
};

module.exports = { notFoundHandler, errorHandler };
