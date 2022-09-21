const bcrypt = require('bcrypt');
const {
    User,
    RefreshToken
} = require('../../../models');
const Validator = require('fastest-validator');
const v = new Validator();
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED,
    JWT_REFRESH_TOKEN_EXPIRED
} = process.env;

module.exports = async (req, res) => {
    const schema = {
        email: 'email|empty:false',
        password: 'string|min:6'
    }

    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res.status(400).json({
            status: 'error',
            message: validate
        });
    }

    const user = await User.findOne({
        where: { email: req.body.email }
    });

    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'user not found'
        });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'password not match'
        });
    }

    const dataUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        profession: user.profession
    }

    const token = jwt.sign({ dataUser }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
    const refreshToken = jwt.sign({ dataUser }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRED });

    const createdRefreshToken = await RefreshToken.create({
        token: refreshToken,
        user_id: user.id
    });

    return res.json({
        status: 'success',
        data: {
            token: token,
            refresh_token: refreshToken
        }
    });
}