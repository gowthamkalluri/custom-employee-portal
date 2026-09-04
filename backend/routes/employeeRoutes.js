const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");
const { getEmployees } = require("../controllers/employeeController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("view_employees"),
  getEmployees
);

module.exports = router;