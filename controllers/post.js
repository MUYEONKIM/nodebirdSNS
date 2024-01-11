const { Post, Comment } = require('../models');

exports.afterUploadImage = (req, res) => {
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      img: req.body.img,
      UserId: req.user.id,
    });
    res.send('성공');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const post = await Comment.create({
      comment: req.body.comment,
      PostId: req.body.PostId,
      UserId: req.user.id,
    });
    res.send('댓글이 등록되었습니다.');
  } catch (error) {
    console.error(error);
    next(error);
  }
};