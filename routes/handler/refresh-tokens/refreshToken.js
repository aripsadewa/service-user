const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../../../models');
const {
    JWT_SECRET,
    JWT_SECRET_REFRESH_TOKEN,
    JWT_ACCESS_TOKEN_EXPIRED
} = process.env;

module.exports = async (req, res) => {
    try {
        const refreshToken = req.body.refresh_token;
        const email = req.body.email;

        if (!refreshToken || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'invalid token'
            });
        };

        const token = await RefreshToken.findOne({
            where: { token: refreshToken }
        });

        if (!token) {
            return res.status(400).json({
                status: 'error',
                message: 'invalid token'
            });
        }

        jwt.verify(refreshToken, JWT_SECRET_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    message: err.message
                });
            }

            if (email !== decoded.dataUser.email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'email is not valid'
                });
            }

            const token = jwt.sign({ data: decoded.data }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED });
            return res.json({
                status: 'success',
                data: {
                    token
                }
            });
        });

    } catch (error) {

        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ status: 'error', message: 'service unavailable' });
        }

        return res.status(403).json({
            status: 'error',
            message: "error unauth"
        });
    }
}