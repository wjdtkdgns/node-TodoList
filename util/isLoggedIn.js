const customError = require("./error/customError");
exports.isLoggedIn = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      next();
    } else {
      throw new customError("already logged in", 404, "log in Error");
    }
  } catch (err) {
    next(err);
  }
};
