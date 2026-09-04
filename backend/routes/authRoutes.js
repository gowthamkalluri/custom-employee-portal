const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const permissionMiddleware = require("../middleware/permissionMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.put(
  "/profile",
  authMiddleware,
  permissionMiddleware("update_profile"),
  updateProfile,
);

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("Admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin! You have access to this route.",
    });
  },
);

router.get(
  "/employee-test",
  authMiddleware,
  permissionMiddleware("view_employees"),
  (req, res) => {
    res.json({
      message: "You have permission to view employees.",
    });
  },
);

module.exports = router;
