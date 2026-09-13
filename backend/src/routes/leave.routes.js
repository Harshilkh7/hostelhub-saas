const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");
const { createLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require("../controllers/leave.controller");

router.use(authenticate, tenant);
router.post("/", authorize("STUDENT"), createLeave);
router.get("/my", authorize("STUDENT"), getMyLeaves);
router.get("/", authorize("HOSTEL_ADMIN", "SUPER_ADMIN", "WARDEN"), getAllLeaves);
router.patch("/:id", authorize("HOSTEL_ADMIN", "SUPER_ADMIN", "WARDEN"), updateLeaveStatus);

module.exports = router;
