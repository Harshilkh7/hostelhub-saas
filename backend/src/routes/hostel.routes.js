const express = require("express");
const router = express.Router();
const { createHostel, getHostels } = require("../controllers/hostel.controller");
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");

router.use(authenticate, tenant);
router.post("/", authorize("SUPER_ADMIN", "HOSTEL_ADMIN"), createHostel);
router.get("/", getHostels);

module.exports = router;
