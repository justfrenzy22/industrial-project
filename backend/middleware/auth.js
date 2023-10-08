const jwt = require('jsonwebtoken');
const User = require('../schema');
const jwt_key = process.env.JWT_SECRET_KEY;

const auth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: 'Authentication failed'});
    }

    try {
        const decoded = jwt.verify(token,  jwt_key);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({message: 'Invalid token'})
    }
}

module.exports = auth;