const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
} = require("../controllers/complaint.controller");

router.post(
  "/",
  authenticate,
  authorize("STUDENT"),
  createComplaint
);

router.get(
  "/my",
  authenticate,
  authorize("STUDENT"),
  getMyComplaints
);

router.get(
  "/",
  authenticate,
  authorize(
    "HOSTEL_ADMIN",
    "SUPER_ADMIN"
  ),
  getAllComplaints
);

router.patch(
  "/:id",
  authenticate,
  authorize(
    "HOSTEL_ADMIN",
    "SUPER_ADMIN"
  ),
  updateComplaintStatus
);

module.exports = router;