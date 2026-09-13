const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");
const { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require("../controllers/complaint.controller");

router.use(authenticate, tenant);
router.post("/", authorize("STUDENT"), createComplaint);
router.get("/my", authorize("STUDENT"), getMyComplaints);
router.get("/", authorize("HOSTEL_ADMIN", "SUPER_ADMIN", "WARDEN"), getAllComplaints);
router.patch("/:id", authorize("HOSTEL_ADMIN", "SUPER_ADMIN", "WARDEN"), updateComplaintStatus);

module.exports = router;
