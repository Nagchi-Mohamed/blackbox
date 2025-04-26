const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = {
  verifyToken,
  generateToken
}; 