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
    console.log(post.id)
    res.status(200).json({
      code: 200,
      id: post.id
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    await Comment.create({
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
    const result = await Comment.update({
      comment: req.body.comment,
    }, {
      where: {
        id: req.params.commentId,
        UserId: req.user.id,
      }
    });
    console.log(result, "수정됬냐?")
    if (result[0] === 0) {
      return res.status(403).json({
        code: 403,
        message: "권한이 없습니다"
      })
    }
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
    const result = await Comment.destroy({
      where: {
        id: req.params.commentId,
        UserId: req.user.id,
      }
    }); // force : true로 주면 softdelete여도 강제삭제 가능
    console.log(result, "삭제됬냐??")

    if (result === 0) {
      return res.status(403).json({
        code: 403,
        message: "권한이 없습니다"
      })
    }

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
