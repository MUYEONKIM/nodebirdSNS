const jwt = require('jsonwebtoken');
const { User, Post, Hashtag } = require('../models');
// createToken이 있었던 이유는 token 테스트를 하기 위해서 로그인 후 저걸 집어 넣기 때뭉네 user의 정보가 있었던 것

exports.createToken = async (req, res) => {
  // try {
  //   const user = await User.findOne({
  //     where: { id: req.user?.id || null },
  //   });
  //   console.log(user)
  //   return "qq";
  //   // return res.send("qq")
  //   // const token = jwt.sign({
  //   //   id: user.id,
  //   //   nick: user.nick,
  //   // }, process.env.JWT_SECRET, {
  //   //   expiresIn: '30m', // 30분
  //   //   issuer: 'nodebird',
  //   // });
  //   // return res.json({
  //   //   code: 200,
  //   //   message: '토큰이 발급되었습니다',
  //   //   token,
  //   // });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({
  //     code: 500,
  //     message: '서버 에러',
  //   });
  // }
  // const user = await User.findOne({
  //   // where: { id: req.user?.id || null },
  // });
  // console.log(req)
  return
};

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

exports.getPostsByHashtag = async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};
