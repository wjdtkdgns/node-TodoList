const Todo = require("./../model/todoModel");

exports.getTodoAll = async (req, res) => {
  try {
    const todos = await Todo.find();
    res
      .status(200)
      .json({ status: "success", result: todos.length, data: { todos } });
  } catch (err) {
    res.status(400).json({ status: "fail", err });
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

exports.makeTodo = async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    res.status(200).json({ status: "success", data: newTodo });
  } catch (err) {
    res.status(400).json({ status: "fail", err });
  }
};

exports.deleteTodoOne = async (req, res) => {
  try {
    const todos = await Todo.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", err });
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
