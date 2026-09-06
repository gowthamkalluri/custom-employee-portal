const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getAdminStats } = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", authMiddleware, roleMiddleware("Admin"), getAdminStats);

module.exports = router;
