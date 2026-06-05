const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get(
  "/stats",
  authenticate,
  authorize("HOSTEL_ADMIN", "SUPER_ADMIN"),
  async (req, res) => {
    try {
      const hostels = await pool.query(
        "SELECT COUNT(*) FROM hostels"
      );

      const rooms = await pool.query(
        "SELECT COUNT(*) FROM rooms"
      );

      const leaves = await pool.query(
        "SELECT COUNT(*) FROM leave_requests"
      );

      const complaints = await pool.query(
        "SELECT COUNT(*) FROM complaints"
      );

      res.json({
        hostels: Number(hostels.rows[0].count),
        rooms: Number(rooms.rows[0].count),
        leaves: Number(leaves.rows[0].count),
        complaints: Number(complaints.rows[0].count),
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

module.exports = router;