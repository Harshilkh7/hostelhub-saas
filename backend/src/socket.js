const jwt = require("jsonwebtoken");
const pool = require("./config/db");
const { parseCookies, ACCESS_COOKIE, accessSecret } = require("./controllers/auth.controller");

const registerSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies({ headers: { cookie: socket.handshake.headers.cookie || "" } });
      const token = cookies[ACCESS_COOKIE];
      if (!token) return next(new Error("Authentication required"));
      const user = jwt.verify(token, accessSecret());
      if (user.type !== "access" || !user.organizationId || !user.sid) return next(new Error("Invalid access token"));
      const session = await pool.query(`SELECT id FROM auth_sessions WHERE id=$1 AND user_id=$2 AND revoked_at IS NULL AND refresh_expires_at > NOW()`, [user.sid, user.userId]);
      if (!session.rows.length) return next(new Error("Session revoked or expired"));
      socket.user = user;
      next();
    } catch (error) { next(new Error("Invalid or expired access token")); }
  });

  io.on("connection", (socket) => {
    socket.join(`org:${socket.user.organizationId}`);
    socket.emit("connected", { userId: socket.user.userId, role: socket.user.role, organizationId: socket.user.organizationId });
  });
};
module.exports = registerSocket;
