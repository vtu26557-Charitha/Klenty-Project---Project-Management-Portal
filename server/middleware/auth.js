const jwt = require('jsonwebtoken');
const { models, useJson, jsonStore } = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies?.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'projectnest_secret');
    req.user = decoded;
    if (useJson) {
      const user = jsonStore.users.find((u) => u.id === decoded.id);
      req.userRecord = user;
    } else {
      req.userRecord = await models.User.findByPk(decoded.id);
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
