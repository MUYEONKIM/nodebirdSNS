const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log("성공입니다", user.id)
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id }
    })
      .then(user => {
        console.log('로그인 성공');
        done(null, user);
      })
      .catch((err) => {
        console.log('에러입니다', err)
        done(err);
      });
  });

  local();
  kakao();
};
