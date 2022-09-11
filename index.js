const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const todoRouter = require("./routes/todoRoutes");
const authRouter = require("./routes/authRoutes");
const session = require("express-session");
const MongoDBStore = require("express-mongodb-session")(session);
const bcrypt = require("bcrypt");
const User = require("./model/userModel");

const app = express();

// env setting
dotenv.config({ path: "./config.env" });

const DB = process.env.DB.replace("<password>", process.env.DB_PWD);

// connecting db
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
const passport = require("passport");
const JsonStrategy = require("passport-json").Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log("serializeUser", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id } });
  console.log("deserializeUser", id, user);
  done(null, user);
});

passport.use(
  new JsonStrategy(
    {
      usernameProp: "id",
      passwordProp: "pwd",
    },
    async (username, password, done) => {
      console.log("passport");
      try {
        console.log("LocalStrategy", username, password);
        const user = await User.findOne({ id: username });
        if (user) {
          await bcrypt.compare(password, user.pwd, function (err, result) {
            if (result) {
              console.log(2);
              return done(null, user, {
                message: "Welcome.",
              });
            } else {
              console.log(3);
              return done(null, false, {
                message: "Password is not correct.",
              });
            }
          });
        } else {
          console.log(4);
          return done(null, false, { message: "There is no id." });
        }
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);

app.use((req, res, next) => {
  console.log("middleware test");
  next();
});

// router
app.use("/api/v1/todo", todoRouter);
app.use("/api/v1/auth", authRouter);

app.use(morgan("dev"));

app.listen(3000, () => {
  console.log("start server");
});
