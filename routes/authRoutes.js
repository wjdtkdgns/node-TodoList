const express = require("express");
const authController = require("../controller/authController");
const passport = require("passport");

const authRouter = express.Router();

authRouter.route("/login").get((req, res, next) => {
  passport.authenticate("json", (authError, user, info) => {
    // (authError, user, info) => 이 콜백 미들웨어는 localstrategy에서 done()이 호출되면 실행된다.
    // localstrategy에 done()함수에 로직 처리에 따라 1,2,3번째 인자에 넣는 순서가 달랐는데 그 이유가 바로 이것이다.

    console.log(123123123, authError, user, info);
    // done(err)가 처리된 경우
    if (authError) {
      console.error(authError);
      return next(authError); // 에러처리 미들웨어로 보낸다.
    }
    // done(null, false, { message: '비밀번호가 일치하지 않습니다.' }) 가 처리된 경우
    if (!user) {
      // done()의 3번째 인자 { message: '비밀번호가 일치하지 않습니다.' }가 실행
      return res.redirect(`/?loginError=${info.message}`);
    }

    // done(null, exUser)가 처리된경우, 즉 로그인이 성공(user가 false가 아닌 경우), passport/index.js로 가서 실행시킨다.
    return req.login(user, (loginError) => {
      // loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
      // 만일 done(err) 가 됬다면,
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return next();
    });
  })(
    req,
    res,
    next // 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
  );
}, authController.login);
// passport.authenticate 는 middleware이다. function 안에서 실행시키면 안된다.

authRouter.route("/signup").post(authController.signUp);

authRouter.route("/logout").get(authController.logout);

module.exports = authRouter;
