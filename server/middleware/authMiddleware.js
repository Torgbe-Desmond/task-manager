const jwt = require('jsonwebtoken');
const UNAUTHORIZED = require('../errors/unauthorized');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const headersArray = req.rawHeaders;
  if (headersArray) {
    const cookieHeader = headersArray[headersArray.indexOf('Cookie') + 1];
    const taskToken = cookieHeader.split('taskToken=')[1];
    if (!taskToken) {
      throw new UNAUTHORIZED('Unauthorized');
    }
    try {
      const decoded = jwt.verify(taskToken, process.env.JWT_SECRET);
      const userExist = await User.findById(decoded.id);
      if (!userExist) {
        throw new UNAUTHORIZED('Unauthorized');
      }
      req.userId = userExist._id;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new UNAUTHORIZED('Unauthorized');
    }
  } else {
    throw new UNAUTHORIZED('Unauthorized: No Authorization header');
  }
};

module.exports = authMiddleware;
