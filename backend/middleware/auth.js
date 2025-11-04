const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const CA = require('../models/ca.model.js');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user or CA to request
      req.user = await User.findById(decoded.id).select('-password');
      req.ca = await CA.findById(decoded.id).select('-password');

      if (!req.user && !req.ca) {
        return res.status(404).json({ message: 'User or CA not found' });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Export as both the default function and a named property so existing
// imports like `const auth = require(...);` and
// `const { protect } = require(...);` both work.
module.exports = protect;
module.exports.protect = protect;
