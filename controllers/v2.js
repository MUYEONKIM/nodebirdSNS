const jwt = require('jsonwebtoken');
const sequelize = require('sequelize')
const { User, Post, Comment } = require('../models');
const Op = sequelize.Op;

exports.getMyPosts = (req, res) => {
  Post.findAll({ where: { userId: res.locals.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
};

exports.getPosts = async (req, res) => {
  try {
    const boardList = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
      where: req.query.search ? { title: { [Op.like]: `%${req.query.search}%` } } : {},
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
        attributes: ['comment', 'UserId'],
      },
      where: { id: req.params.contentId },
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
