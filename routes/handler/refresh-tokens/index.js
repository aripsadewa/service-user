const create = require('./create');
const getToken = require('./getToken');
const register = require('./register');
const login = require('./login');
const refreshToken = require('./refreshToken');

module.exports = {
    create,
    getToken,
    login,
    register,
    refreshToken
}