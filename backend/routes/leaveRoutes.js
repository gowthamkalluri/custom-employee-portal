const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("apply_leave"),
  applyLeave,
);

router.get("/", authMiddleware, permissionMiddleware("view_leave"), getLeaves);

router.put(
  "/:id/status",
  authMiddleware,
  permissionMiddleware("approve_leave"),
  updateLeaveStatus,
);

module.exports = router;
