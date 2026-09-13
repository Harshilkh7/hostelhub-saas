const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");
const { listStudents, createStudent } = require("../controllers/student.controller");

router.get("/profile", authenticate, tenant, (req, res) => {
  res.json({ user: req.user, organization: req.organization });
});

router.get("/students", authenticate, tenant, authorize("SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"), listStudents);
router.post("/students", authenticate, tenant, authorize("SUPER_ADMIN", "HOSTEL_ADMIN", "WARDEN"), createStudent);

module.exports = router;
