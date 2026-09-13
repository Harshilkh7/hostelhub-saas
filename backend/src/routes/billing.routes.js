const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");
const { createCheckoutSession, getSubscription, handleWebhook } = require("../controllers/billing.controller");

// Stripe requires the raw request body for signature verification.
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);
router.use(express.json());
router.use(authenticate, tenant);
router.get("/subscription", getSubscription);
router.post("/checkout", authorize("HOSTEL_ADMIN", "SUPER_ADMIN"), createCheckoutSession);

module.exports = router;
