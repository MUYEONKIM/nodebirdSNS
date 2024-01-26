const sequelize = require('sequelize')
const { User, Post, Comment } = require('../models');
const Op = sequelize.Op;

exports.getPosts = async (req, res) => {
  try {
    const boardList = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
      where:
        req.query.search
          ? { title: { [Op.like]: `%${req.query.search}%` } }
          : req.params.id ? { userId: req.params.id } : {},
    });
    if (!boardList) {
      return res.json({
        code: 200,
        message: '게시글이 없습니다',
      });
    };
    let countPerPage = 10;
    let pageNo = req.query.page;
    if (!pageNo) {
      pageNo = 1;
    }
    console.log(req.query.page)
    // 전체 크기
    let totalCount = boardList.length;
    // 시작 번호
    let start = ((pageNo - 1) * countPerPage);
    // 종료 번호
    let end = (pageNo * countPerPage) - 1;
    // 종료 번호가 전체 크기보다 크면 전체 크기로 변경
    if (end > (totalCount - 1)) {
      end = totalCount - 1;
    }
    let boardPageList = [];
    if (start < totalCount) {
      for (let index = start; index <= end; index++) {
        boardPageList.push(boardList[index]);
      }
    }
    return res.json({
      code: 200,
      payload: boardPageList,
      length: totalCount
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      // 배열에 댓글들 담겨있게 됨
      include: {
        model: Comment,
        attributes: ['comment', 'UserId', 'id', 'createdAt'],
      },
      where: { id: req.params.contentId },
      order: [[Comment, 'createdAt', 'DESC']]
    });
    if (!post) {
      return res.json({
        code: 404,
        message: '게시글이 존재하지 않습니다.',
      });
    }
    return res.json({
      code: 200,
      payload: post,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const result = await Post.update({
      title: req.body.title,
      content: req.body.content,
      img: req.body.img,
    }, {
      where: {
        id: req.params.contentId,
        UserId: req.user.id
      }
    });
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

exports.deletePost = async (req, res) => {
  try {
    const result = await Post.destroy({
      where: {
        id: req.params.contentId,
        UserId: req.user.id
      }
    }); // force : true로 주면 softdelete여도 강제삭제 가능
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
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
}
