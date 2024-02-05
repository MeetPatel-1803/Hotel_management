const errorHandler = (err, statuscode, res) => {
  return res.status(statuscode).json({
    error: err,
  });
};

module.exports = errorHandler;
