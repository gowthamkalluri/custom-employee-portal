const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const register = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, role_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role_id],
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await pool.execute(
      `SELECT users.*, roles.name AS role_name
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.email = ?`,
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.role_id,
        role: user.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT
        u.id,
        u.name,
        u.email,
        r.name AS role,
        e.department,
        e.job_title,
        e.phone,
        e.joining_date
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN employees e ON u.id = e.user_id
       WHERE u.id = ?`,
      [req.user.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: users[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const [result] = await pool.execute(
      `UPDATE users
       SET name = ?, email = ?
       WHERE id = ?`,
      [name, email, req.user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
