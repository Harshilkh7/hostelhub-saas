const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { getOverview } = require("../controllers/superadmin.controller");

const router = express.Router();

router.get("/overview", authenticate, authorize("SUPER_ADMIN"), getOverview);

module.exports = router;
