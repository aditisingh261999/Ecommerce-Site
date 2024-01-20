// Not Found
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Not Found: ${req.originalUrl}` });
};

// Error Handler
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error?.message,
    stack: error?.stack,
  });
};

module.exports = { errorHandler, notFound };
