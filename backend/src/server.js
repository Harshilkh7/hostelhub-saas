require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const registerSocket = require("./socket");
const { ensureAuthSessionsTable } = require("./services/auth.service");

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173,https://hostelhub-saas.vercel.app")
  .split(",").map((v) => v.trim()).filter(Boolean);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST", "PATCH", "DELETE"], credentials: true },
});
app.set("io", io);
registerSocket(io);

ensureAuthSessionsTable()
  .then(() => server.listen(PORT, () => console.log(`HostelHub server running on ${PORT}`)))
  .catch((error) => {
    console.error("Failed to initialize authentication sessions table:", error);
    process.exit(1);
  });
