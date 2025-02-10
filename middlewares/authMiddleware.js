const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
};


const verifyAdmin = async (req, res, next) => {
  try {
      const token = req.header("Authorization");
      if (!token) return res.status(403).json({ message: "Access denied" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
      }

      req.user = user;
      next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = { protect,verifyAdmin };
