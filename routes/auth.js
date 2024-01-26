const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
  failureRedirect: 'http://localhost:3000',
}), (req, res) => {
  const token = jwt.sign({
    id: req.user.id,
    nick: req.user.nick
  }, process.env.JWT_SECRET, {
    expiresIn: '30m',
    issuer: 'nodebird',
  })
  const query = "?token=" + token;

  res.redirect(`http://localhost:3000/kakao/query:${query}`); // 성공 시에는 /로 이동
});

module.exports = router;

