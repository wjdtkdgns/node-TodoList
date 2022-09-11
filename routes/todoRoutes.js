const express = require("express");
const todoController = require("./../controller/todoController");

const todoRouter = express.Router();

todoRouter
  .route("/")
  .get(todoController.getTodoAll)
  .post(todoController.makeTodo);

todoRouter
  .route("/:id")
  .get(todoController.getTodoOne)
  .delete(todoController.deleteTodoOne)
  .patch(todoController.updateTodoOne);

module.exports = todoRouter;
