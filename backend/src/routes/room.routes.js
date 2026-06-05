const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const {
  createRoom,
  getRooms
} = require("../controllers/room.controller");

router.post(
  "/",
  authenticate,
  authorize(
    "HOSTEL_ADMIN",
    "SUPER_ADMIN"
  ),
  createRoom
);

router.get(
  "/",
  authenticate,
  getRooms
);

module.exports = router;