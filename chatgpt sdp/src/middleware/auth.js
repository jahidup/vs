const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sankalp_enterprise_secret_key_2026_prod';

// Protect private API routes
const protectAPI = (req, res, next) => {
  const token = req.cookies.admin_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or Expired Session Token' });
  }
};

// Protect dynamic admin web pages (redirects to login)
const protectView = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.redirect('/admin');
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.clearCookie('admin_token');
    res.redirect('/admin');
  }
};

module.exports = { protectAPI, protectView };
