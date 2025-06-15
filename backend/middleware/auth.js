const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    console.log('Auth Middleware: User authenticated. Role:', req.user.role);
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize Middleware: Checking role for user:', req.user?.role, ' against allowed roles:', roles);
    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Authorize Middleware: Role not permitted. User role:', req.user?.role, ' Allowed roles:', roles);
      return res.status(403).json({
        error: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};

module.exports = {
  auth,
  authorize,
}; 