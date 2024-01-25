const { Post, Comment } = require('../models');

exports.afterUploadImage = (req, res, next) => {
  if (!req.file) return res.send("qwe")
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

exports.updateComment = async (req, res) => {
  try {
    Comment.update({
      comment: req.body.comment,
    }, {
      where: { id: req.params.commentId }
    });
    return res.json({
      code: 200,
      message: '수정 완료'
    })
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
}

exports.deleteComment = async (req, res) => {
  try {
    Comment.destroy({
      where: { id: req.params.commentId }
    }); // force : true로 주면 softdelete여도 강제삭제 가능
    return res.json({
      code: 200,
      message: '삭제 완료'
    })
  } catch (error) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
}
