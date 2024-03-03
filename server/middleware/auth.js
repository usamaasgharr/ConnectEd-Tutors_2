// auth.js (server/middleware/auth.js)

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Attach the user ID to the request for use in controllers
    req.user = { userId: decodedToken.userId, role: decodedToken.role };
    

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;
