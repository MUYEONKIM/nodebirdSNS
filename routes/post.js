const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, createComment } = require('../controllers/post');
const { verifyToken, isLoggedIn } = require('../middlewares');

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
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);
// router.post('/img', verifyToken, upload.single('img'), afterUploadImage);
// router.post('/img');

// POST /post
const upload2 = multer();
router.post('/', uploadPost);
// router.post('/', verifyToken, upload2.none(), uploadPost);

router.get('/test', isLoggedIn, (req, res) => {
  res.send("qqq")
})

router.post('/comment', isLoggedIn, createComment);

module.exports = router;
