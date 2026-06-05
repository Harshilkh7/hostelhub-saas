const express = require("express");

const router = express.Router();

const {
  createHostel,
  getHostels,
} = require("../controllers/hostel.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HOSTEL_ADMIN"),
  createHostel
);

router.get(
  "/",
  authenticate,
  getHostels
);

module.exports = router;