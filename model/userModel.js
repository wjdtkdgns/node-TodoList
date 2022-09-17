const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  id: { type: String, required: [true, "date empty"] },
  pwd: { type: String, required: [true, "title empty"] },
  userNum: { type: Number, default: 10000 },
  name: { type: String, required: [true, "name empty"] },
});
userSchema.plugin(AutoIncrement, { start_seq: 10000, inc_field: "userNum" });

const user = mongoose.model("user", userSchema);

module.exports = user;
