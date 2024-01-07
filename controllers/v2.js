const jwt = require('jsonwebtoken');
const sequelize = require('sequelize')
const { User, Post } = require('../models');
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
      where: req.body.search ? { title: { [Op.like]: `%${req.body.search}%` } } : {},
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
