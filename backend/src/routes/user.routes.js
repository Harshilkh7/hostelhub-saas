const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");

router.get("/profile", authenticate, tenant, (req, res) => {
  res.json({ user: req.user, organization: req.organization });
});

module.exports = router;
