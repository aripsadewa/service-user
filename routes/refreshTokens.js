const express = require('express');
const router = express.Router();

const refreshTokensHandler = require('./handler/refresh-tokens');

router.post('/login', refreshTokensHandler.login);
router.post('/register', refreshTokensHandler.register);
router.post('/refresh-token', refreshTokensHandler.refreshToken);

module.exports = router;
