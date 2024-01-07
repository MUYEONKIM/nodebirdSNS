const express = require('express');

const { verifyToken, apiLimiter } = require('../middlewares');
const { getMyPosts, getPosts } = require('../controllers/v2');

const router = express.Router();

// GET /v2/posts/my
router.get('/posts/my', verifyToken, getMyPosts);
// router.get('/posts/my', apiLimiter, verifyToken, getMyPosts);

// GET /v2/posts/
router.post('/posts', getPosts);
// router.get('/posts/:title', apiLimiter, verifyToken, getPostsBySearch);

module.exports = router;
