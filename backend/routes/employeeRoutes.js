const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");
const {
  getEmployees,
  createEmployee,
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

module.exports = router;
