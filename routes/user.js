const express = require('express');

const { verifyToken } = require('../middlewares');
const { follow } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', follow);
// router.post('/:id/follow', verifyToken, follow);

module.exports = router;
