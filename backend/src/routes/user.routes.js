const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

router.get("/profile", authenticate, async (req, res) => {
  res.json({
    message: "Protected Route",
    user: req.user,
  });
});

module.exports = router;