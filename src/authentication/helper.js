const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_LIFE });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_LIFE });
};

const verifyAuthTokens = (req, res, next) => {
    const authToken = req.headers.authorization || req.cookies.authorization;
    const userId = req.headers['user-id'];
    if (!authToken) {
        res.json({ message: 'Token is missing' });
    }
    let isTokenValid;
    try {
        isTokenValid = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
        console.log(isTokenValid);
        next();
    } catch (error) {
        res.json({ message: 'Token is invalid' });
    }
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAuthTokens
};