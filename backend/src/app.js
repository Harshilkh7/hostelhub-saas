const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/test.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const hostelRoutes = require("./routes/hostel.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hostels", hostelRoutes);

module.exports = app;