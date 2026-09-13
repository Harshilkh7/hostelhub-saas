const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const tenant = require("../middleware/tenant.middleware");
const authorize = require("../middleware/role.middleware");
const { createRoom, getRooms, deleteRoom } = require("../controllers/room.controller");

router.use(authenticate, tenant);
router.post("/", authorize("HOSTEL_ADMIN", "SUPER_ADMIN"), createRoom);
router.get("/", getRooms);
router.delete("/:id", authorize("HOSTEL_ADMIN", "SUPER_ADMIN"), deleteRoom);

module.exports = router;
