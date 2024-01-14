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
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
      where: req.query.search ? { title: { [Op.like]: `%${req.query.search}%` } } : {},
    });
    if (!posts) {
      return res.json({
        code: 200,
        message: '검색 결과가 없습니다',
      });
    }
    return res.json({
      code: 200,
      payload: posts,
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
      where: { id: req.query.contentId },
    });
    if (!post) {
      return res.json({
        code: 200,
        message: '검색 결과가 없습니다',
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
