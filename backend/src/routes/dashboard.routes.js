const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");

router.get("/stats", authenticate, tenant, authorize("HOSTEL_ADMIN", "SUPER_ADMIN", "WARDEN"), async (req, res) => {
  try {
    const org = req.organizationId;
    const [hostels, rooms, students, leaves, complaints] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM hostels WHERE organization_id=$1", [org]),
      pool.query("SELECT COUNT(*) FROM rooms r JOIN hostels h ON r.hostel_id=h.id WHERE h.organization_id=$1", [org]),
      pool.query("SELECT COUNT(*) FROM users WHERE organization_id=$1 AND role='STUDENT'", [org]),
      pool.query("SELECT COUNT(*) FROM leave_requests l JOIN users u ON l.student_id=u.id WHERE u.organization_id=$1", [org]),
      pool.query("SELECT COUNT(*) FROM complaints c JOIN users u ON c.student_id=u.id WHERE u.organization_id=$1", [org]),
    ]);
    res.json({
      hostels: Number(hostels.rows[0].count), rooms: Number(rooms.rows[0].count),
      students: Number(students.rows[0].count), leaves: Number(leaves.rows[0].count), complaints: Number(complaints.rows[0].count),
      organization: req.organization,
    });
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
});

module.exports = router;
