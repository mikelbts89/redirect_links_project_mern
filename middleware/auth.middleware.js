const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.substring("Bearer ".length); // "Bearer Token"
    if (!token) {
      return res.status(401).json({ message: "missing authorization" });
    }
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "missing authorization" });
  }
};
