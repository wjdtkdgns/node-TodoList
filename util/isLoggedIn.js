const customError = require("./error/customError");
exports.isLoggedIn = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      throw new customError("not logged in", 404, "log in Error");
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
