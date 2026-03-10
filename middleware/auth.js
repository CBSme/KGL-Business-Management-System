const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) return res.status(401).json({ error: "No token provided. Please login." });
    const token = header.replace("Bearer ", "");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please login again." });
  }
};
