const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get(
  "/dashboard",
  authenticate,
  authorize("HOSTEL_ADMIN", "SUPER_ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin Dashboard",
    });
  }
);

module.exports = router;