const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Bearer token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.organizationId) {
      return res.status(403).json({ message: "Token has no organization context" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
