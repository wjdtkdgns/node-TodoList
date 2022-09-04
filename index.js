const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const todoRouter = require("./routes/todoRoutes");

const app = express();

dotenv.config({ path: "./config.env" });

const DB = process.env.DB.replace("<password>", process.env.DB_PWD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// bodyParser : request body를 json 형식으로 변환

app.use((req, res, next) => {
  console.log("middleware test");
  next();
});

app.use("/api/v1/todo", todoRouter);

app.use(morgan("dev"));

app.listen(3000, () => {
  console.log("start server");
});
