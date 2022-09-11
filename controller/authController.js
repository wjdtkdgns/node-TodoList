const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.login = async (req, res) => {
  try {
    const { id, pwd } = req.body;
    const user = await User.findOne({ id });
    console.log(user);
    res.status(201).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: "fail", err });
  }
};

exports.logout = (req, res) => {
  try {
    req.logout(() => {
      req.session.destroy();
      res.status(201).json({
        status: "success",
        data: null,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "fail", err });
  }
};

exports.signUp = async (req, res) => {
  try {
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
    res.status(400).json({ status: "fail", err });
  }
};
