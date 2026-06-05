const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require("../controllers/leave.controller");

router.post(
  "/",
  authenticate,
  authorize("STUDENT"),
  createLeave
);

router.get(
  "/my",
  authenticate,
  authorize("STUDENT"),
  getMyLeaves
);

router.get(
  "/",
  authenticate,
  authorize(
    "HOSTEL_ADMIN",
    "SUPER_ADMIN"
  ),
  getAllLeaves
);

router.patch(
  "/:id",
  authenticate,
  authorize(
    "HOSTEL_ADMIN",
    "SUPER_ADMIN"
  ),
  updateLeaveStatus
);

module.exports = router;