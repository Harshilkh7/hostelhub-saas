const jwt = require("jsonwebtoken");

const registerSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user.organizationId) return next(new Error("Organization context missing"));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const room = `org:${socket.user.organizationId}`;
    socket.join(room);
    socket.emit("connected", {
      userId: socket.user.userId,
      role: socket.user.role,
      organizationId: socket.user.organizationId,
    });
  });
};

module.exports = registerSocket;
