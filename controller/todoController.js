const Todo = require("./../model/todoModel");
const User = require("./../model/userModel");
const customError = require("./../util/error/customError");
const mongoose = require("mongoose");
// const db = require();

exports.getTodoAll = async (req, res, next) => {
  try {
    const { id } = req.user.id;
    const user = await User.findOne(id);
    if (!user) {
      throw new customError("wrong user", 404, "signUpError");
    }
    // user.reference.foreach((ref) => {
    //   console.log(1, ref);
    // });
    const todos = await Todo.find();
    res
      .status(200)
      .json({ status: "success", result: todos.length, data: { todos } });
  } catch (err) {
    next(err);
  }
};

exports.getTodoOne = async (req, res) => {
  try {
    // console.log(req.params.id);
    const todos = await Todo.findById(req.params.id);
    res
      .status(200)
      .json({ status: "success", result: todos.length, data: { todos } });
  } catch (err) {
    res.status(400).json({ status: "fail", err });
  }
};

exports.makeTodo = async (req, res, next) => {
  try {
    const newId = mongoose.Types.ObjectId();

    const { id } = req.user.id;
    const user = await User.findOne(id);
    if (!user) {
      throw new customError("wrong user", 404, "signUpError");
    }

    const newTodo = { ...req.body, _id: newId };
    const newDoc = await Todo.create(newTodo);
    if (!newDoc) {
      throw new customError("can't create new todo", 404, "db create error");
    }

    user.reference.push(newDoc._id);
    await user.save();

    res.status(200).json({ status: "success", data: newDoc });
  } catch (err) {
    next(err);
  }
};

exports.deleteTodoOne = async (req, res, next) => {
  try {
    const { userId } = req.user.id;
    const user = await User.findOne(userId);
    if (!user) {
      throw new customError("wrong user", 404, "signUpError");
    }

    // console.log(db[user.reference[0]]);
    const idx = user.reference.findIndex((ref) => {
      return ref.equals(req.params.id);
    });
    if (idx < 0) {
      throw new customError("wrong todo", 404, "todo doesn't exist");
    }
    user.reference.splice(idx, 1);
    console.log(user.reference);
    await user.save();

    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
};

exports.updateTodoOne = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
    const todos = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      // new : return the document after the update is applied
      new: true,
    });
    res.status(200).json({ status: "success", data: todos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "fail", err: err.message });
  }
};
