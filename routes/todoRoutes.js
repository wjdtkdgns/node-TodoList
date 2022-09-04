const express = require("express");
const todoController = require("./../controller/todoController");

const todoRouter = express.Router();

todoRouter
  .route("/")
  .get(todoController.getTodoAll)
  .post(todoController.makeTodo);

todoRouter.route("/:id").get(todoController.getTodoOne);

module.exports = todoRouter;
