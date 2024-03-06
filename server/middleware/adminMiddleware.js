const jwt = require('jsonwebtoken');
const adminSchema = require('../models/admin');

const adminMiddleware = async (req, res, next) => {
  


  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }

  try {
    
    const decodedToken = jwt.verify(token, 'your-secret-key'); 

    
    const admin = await adminSchema.findById(decodedToken.userId);

    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: User is not an admin' });
    }

    next();

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = adminMiddleware;
