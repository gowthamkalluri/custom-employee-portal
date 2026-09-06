const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware("Admin"), getUsers);

router.post("/", authMiddleware, roleMiddleware("Admin"), createUser);

router.put("/:id", authMiddleware, roleMiddleware("Admin"), updateUser);

router.delete("/:id", authMiddleware, roleMiddleware("Admin"), deleteUser);

module.exports = router;
