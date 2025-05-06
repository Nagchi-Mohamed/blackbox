const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('No token provided in request headers');
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.error('Token missing after Bearer prefix');
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Token verification failed in middleware:', ex);
    res.status(401).send('Invalid token.');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Access denied. Admins only.');
  }
};

module.exports = { verifyToken, isAdmin };
