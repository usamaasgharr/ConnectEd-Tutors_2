const jwt = require('jsonwebtoken');
const adminSchema = require('../models/admin');

const adminMiddleware = async (req, res, next) => {

  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/admin');
}

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Attach the user ID to the request for use in controllers
    req.user = { userId: decodedToken.userId, role: decodedToken.role };
    

    next();
  } catch (error) {
    console.error('Error verifying token:', err);
    res.redirect('/login');
  }
};

module.exports = adminMiddleware;
