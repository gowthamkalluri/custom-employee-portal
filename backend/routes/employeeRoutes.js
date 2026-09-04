const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("view_employees"),
  getEmployees,
);

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("create_employee"),
  createEmployee,
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("update_employee"),
  updateEmployee,
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("delete_employee"),
  deleteEmployee,
);

module.exports = router;
