module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next); // it will automatically call next fn with param of err.
};
// An anonymous fn will be assigned to createTour

// since fn in an async fn it will return a promise, which will gets rejected on error. (That's why we don't need 'try' block);
