const express = require('express');

const { verifyToken, apiLimiter, isLoggedIn } = require('../middlewares');
const { updatePost, getPosts, getPost, deletePost } = require('../controllers/board');

const router = express.Router();

// GET /board/posts/:id
router.get('/posts/:id', getPosts);

// GET /board/posts/
router.get('/posts', getPosts);

// GET /board/posts/:contentId
router.get('/post/:contentId', getPost)

// PATCH /board/posts/:contentId
router.patch('/post/:contentId', verifyToken, apiLimiter, isLoggedIn, updatePost)

// DELETE /board/posts/:contentId
router.delete('/post/:contentId', verifyToken, apiLimiter, isLoggedIn, deletePost)

module.exports = router;
