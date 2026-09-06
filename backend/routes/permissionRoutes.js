const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("Admin"), getPermissions);

router.post("/", authMiddleware, roleMiddleware("Admin"), createPermission);

router.put("/:id", authMiddleware, roleMiddleware("Admin"), updatePermission);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deletePermission,
);

module.exports = router;
