const express = require('express');

const { verifyToken, apiLimiter } = require('../middlewares');
const { updatePost, getPosts, getPost, deletePost } = require('../controllers/board');

const router = express.Router();

// GET /board/posts/my
// router.get('/posts/my', verifyToken, getMyPosts);
router.get('/posts/:id', getPosts);
// router.get('/posts/my', apiLimiter, verifyToken, getMyPosts);

// GET /board/posts/
router.get('/posts', getPosts);
// router.get('/posts/:title', apiLimiter, verifyToken, getPostsBySearch);

router.get('/post/:contentId', getPost)

router.patch('/post/:contentId', updatePost)

router.delete('/post/:contentId', deletePost)


module.exports = router;
