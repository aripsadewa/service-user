const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).json({ message: "Error credential" });
        }

        req.user = decoded;
        return next();
    });
}