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
