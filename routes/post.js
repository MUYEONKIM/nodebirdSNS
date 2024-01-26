const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, createComment, updateComment, deleteComment } = require('../controllers/post');
const { verifyToken, isLoggedIn, apiLimiter } = require('../middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      // cb(null, new Date().valueOf() + path.extname(file.originalname))
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', isLoggedIn, verifyToken, apiLimiter, upload.single('img'), afterUploadImage);

// POST /post
router.post('/', uploadPost);

// POST /post/comment
router.post('/comment', isLoggedIn, apiLimiter, createComment);

// PATCH /post/comment/:commentId
router.patch('/comment/:commentId', isLoggedIn, apiLimiter, updateComment);

// DELETE /post/comment/:commentId
router.delete('/comment/:commentId', isLoggedIn, deleteComment);

module.exports = router;
