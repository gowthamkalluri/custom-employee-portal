const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
} = require("../controllers/roleController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("Admin"), getRoles);

router.post("/", authMiddleware, roleMiddleware("Admin"), createRole);

router.put("/:id", authMiddleware, roleMiddleware("Admin"), updateRole);

router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteRole);

router.get(
  "/:id/permissions",
  authMiddleware,
  roleMiddleware("Admin"),
  getRolePermissions,
);

router.put(
  "/:id/permissions",
  authMiddleware,
  roleMiddleware("Admin"),
  updateRolePermissions,
);

module.exports = router;
