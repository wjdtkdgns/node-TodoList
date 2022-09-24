const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  _id: { type: String, required: [true, "id empty"] },
  date: { type: Date, required: [true, "date empty"] },
  title: { type: String, required: [true, "title empty"] },
  detail: { type: String, required: [true, "detail empty"] },
  done: { type: Boolean, default: false },
});

const todo = mongoose.model("todo", todoSchema);

module.exports = todo;
