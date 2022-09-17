const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const todoRouter = require("./routes/todoRoutes");
const authRouter = require("./routes/authRoutes");
const session = require("express-session");
const MongoDBStore = require("express-mongodb-session")(session);
const globalErrorHandler = require("./controller/errorController");
const customError = require("./util/error/customError");

const app = express();

// env setting
dotenv.config({ path: "./config.env" });

// connecting db
const DB = process.env.DB.replace("<password>", process.env.DB_PWD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"));

// setting bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session DB
var store = new MongoDBStore(
  {
    uri: `${DB}`,
    databaseName: "test",
    collection: "sessions",
  },
  function (error) {
    console.log(error);
  }
);

store.on("error", function (error) {
  console.log(error);
});

// session
app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

// passport
require("./lib/passport")(app);

// router
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/auth", authRouter);
app.all("*", (req, res, next) => {
  const err = new customError(`Can't find ${req.originalUrl} on this server!`);
  next(err);
});

app.use(morgan("dev"));

app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log("start server");
});
