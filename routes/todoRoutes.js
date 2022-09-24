const express = require("express");
const todoController = require("./../controller/todoController");
const { isLoggedIn } = require("../util/isLoggedIn");

const todoRouter = express.Router();

todoRouter.use(isLoggedIn);

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
