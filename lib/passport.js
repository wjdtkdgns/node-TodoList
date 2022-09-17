const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports = (app) => {
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
};
