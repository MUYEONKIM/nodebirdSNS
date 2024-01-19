const express = require('express');
const passport = require('passport');

const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', join);

// POST /auth/login
router.post('/login', login);

// GET /auth/logout
router.get('/logout', logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
  res.json({
    code: 200,
    message: '카카오 로그인에 성공하였습니다.',
    user: req.user
  })
  // res.send('http://localhost:3000'); // 성공 시에는 /로 이동
});

module.exports = router;
