const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const createAuditLog = require("../utils/auditLogger");

const getUsers = async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role_id,
        r.name AS role,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id DESC
    `);

    res.json({
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        message: "name, email, password and role_id are required",
      });
    }

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const [roles] = await pool.execute("SELECT id FROM roles WHERE id = ?", [
      role_id,
    ]);

    if (roles.length === 0) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users
       (name, email, password_hash, role_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, role_id],
    );

    await createAuditLog({
      userId: req.user.userId,
      action: "CREATE",
      resource: "USER",
      resourceId: result.insertId,
      details: `Created user ${email}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role_id } = req.body;

    if (!name || !email || !role_id) {
      return res.status(400).json({
        message: "name, email and role_id are required",
      });
    }

    const [users] = await pool.execute("SELECT id FROM users WHERE id = ?", [
      id,
    ]);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [existingUsers] = await pool.execute(
      `SELECT id
       FROM users
       WHERE email = ?
       AND id != ?`,
      [email, id],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const [roles] = await pool.execute("SELECT id FROM roles WHERE id = ?", [
      role_id,
    ]);

    if (roles.length === 0) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    await pool.execute(
      `UPDATE users
       SET name = ?,
           email = ?,
           role_id = ?
       WHERE id = ?`,
      [name, email, role_id, id],
    );

    await createAuditLog({
      userId: req.user.userId,
      action: "UPDATE",
      resource: "USER",
      resourceId: id,
      details: `Updated user ${email}`,
      ipAddress: req.ip,
    });

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === Number(req.user.userId)) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await createAuditLog({
      userId: req.user.userId,
      action: "DELETE",
      resource: "USER",
      resourceId: id,
      details: `Deleted user ${id}`,
      ipAddress: req.ip,
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
