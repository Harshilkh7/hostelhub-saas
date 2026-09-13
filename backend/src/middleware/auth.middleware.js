const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { parseCookies, ACCESS_COOKIE, accessSecret } = require("../controllers/auth.controller");

const authenticate = async (req, res, next) => {
  try {
    const cookies = parseCookies(req);
    const token = cookies[ACCESS_COOKIE];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(token, accessSecret());
    if (decoded.type !== "access" || !decoded.userId || !decoded.organizationId || !decoded.sid) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const session = await pool.query(`SELECT id FROM auth_sessions WHERE id=$1 AND user_id=$2 AND revoked_at IS NULL AND refresh_expires_at > NOW()`, [decoded.sid, decoded.userId]);
    if (!session.rows.length) return res.status(401).json({ message: "Session revoked or expired" });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};

module.exports = authenticate;
