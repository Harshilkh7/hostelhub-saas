const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");

router.get("/dashboard", authenticate, tenant, authorize("HOSTEL_ADMIN", "SUPER_ADMIN", "WARDEN"), (req, res) => {
  res.json({ message: "Admin Dashboard", organization: req.organization });
});

module.exports = router;
