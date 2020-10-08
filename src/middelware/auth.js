const jwt = require('jsonwebtoken');
const User = require('../db/model/user');
const constants = require('../../constants');
// create auth function for using as middelware in methode
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = await jwt.verify(token, constants.jwtSecret);
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });
        if (!user) throw new Error('not found');

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.jsn(e).status(400);
    }
};

module.exports = auth;