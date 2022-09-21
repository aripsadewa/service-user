const { User } = require('../../../models');

module.exports = async (req, res) => {

    const ids = req.query.ids;
    const userIds = ids.split(',');

    const sqlOPtions = {
        attributes: ['id', 'name', 'email', 'role', 'profession', 'avatar']
    }

    if (userIds.length) {
        sqlOPtions.where = {
            id: userIds
        }
    }

    const users = await User.findAll(sqlOPtions);

    return res.json({
        status: 'success',
        data: users
    });
}