const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: [true, "date empty"] },
  pwd: { type: String, required: [true, "title empty"] },
  _id: { type: String, required: [true, "detail empty"] },
  name: { type: String, required: [true, "name empty"] },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
