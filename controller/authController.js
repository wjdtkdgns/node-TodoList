const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const customError = require("../util/error/customError");

exports.login = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  try {
    req.logout(() => {
      req.session.destroy();
      res.status(201).json({
        status: "success",
        statusCode: 200,
        data: {},
      });
    });
  } catch (err) {
    next(new customError("fail logout"), 404, "fail logout");
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { id, pwd, name } = req.body;
    const exUser = await User.findOne({ id });
    if (exUser) {
      throw new customError("duplicate user", 404, "signUpError");
    }

    bcrypt.hash(req.body.pwd, 10, async (err, hash) => {
      const user = {
        _id: shortid.generate(),
        id: req.body.id,
        pwd: hash,
        name: req.body.name,
      };
      User.create(user);

      res.status(201).json({
        status: "success",
        data: null,
      });
    });
  } catch (err) {
    if (err instanceof customError) next(err);
    next(new customError("fail signUp", 404, "fail sign up"));
  }
};
