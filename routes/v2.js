const express = require('express');

const { verifyToken, apiLimiter } = require('../middlewares');
const { createToken, getMyPosts, getPostsByHashtag } = require('../controllers/v2');

const router = express.Router();


// POST /v2/token
router.post('/token', apiLimiter, createToken);

// GET /v2/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPosts);

// GET /v2/posts/hashtag/:title
router.get('/posts/hashtag/:title', apiLimiter, verifyToken, getPostsByHashtag);

module.exports = router;
