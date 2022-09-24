const User = require("../model/userModel");
const bcrypt = require("bcrypt");
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
    next(new customError("fail logout", 404, "fail logout"));
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { id, pwd, name } = req.body;
    const exUser = await User.findOne({ id });
    if (exUser) {
      throw new customError("duplicate user", 404, "signUpError");
    }

    bcrypt.hash(pwd, 10, async (err, hash) => {
      const user = {
        id,
        pwd: hash,
        name,
      };
      User.create(user);

      res.status(201).json({
        status: "success",
        data: null,
      });
    });
  } catch (err) {
    if (err instanceof customError) {
      next(err);
    } else {
      next(new customError("fail signUp", 404, "fail sign up"));
    }
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { id, pwd } = req.body;
    console.log(id);
    const user = await User.findOne({ id });
    console.log(111111, user);
    if (!user) throw new customError("wrong user", 404, "can't find user");
    bcrypt.hash(pwd, 10, async (err, hash) => {
      user.pwd = hash;
      await user.save();
    });
    console.log(222222, user);
    req.logout(() => {
      req.session.destroy();
      res.status(201).json({
        status: "success",
        statusCode: 200,
        data: {},
      });
    });
  } catch (err) {
    console.log(err);
    if (err instanceof customError) {
      next(err);
    } else {
      // console.log(err);
      next(new customError("fail logout"), 404, "fail logout");
    }
  }
};
