const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const getEmployees = async (req, res) => {
  try {
    const [employees] = await pool.execute(`
      SELECT
        e.id,
        u.id AS user_id,
        u.name,
        u.email,
        u.role_id,
        r.name AS role,
        e.department,
        e.job_title,
        e.phone,
        e.joining_date
      FROM employees e
      JOIN users u ON e.user_id = u.id
      JOIN roles r ON u.role_id = r.id
      ORDER BY e.id DESC
    `);

    res.json({
      employees,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};

const createEmployee = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      name,
      email,
      password,
      role_id,
      department,
      job_title,
      phone,
      joining_date,
    } = req.body;

    if (!name || !email || !password || !role_id || !department || !job_title) {
      return res.status(400).json({
        message:
          "name, email, password, role_id, department and job_title are required",
      });
    }

    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE id = ?",
      [role_id],
    );

    if (roles.length === 0) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `INSERT INTO users
       (name, email, password_hash, role_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, role_id],
    );

    const userId = userResult.insertId;

    const [employeeResult] = await connection.execute(
      `INSERT INTO employees
       (user_id, department, job_title, phone, joining_date)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, department, job_title, phone || null, joining_date || null],
    );

    await connection.commit();

    res.status(201).json({
      message: "Employee created successfully",
      employeeId: employeeResult.insertId,
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to create employee",
    });
  } finally {
    connection.release();
  }
};

const updateEmployee = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const { name, email, role_id, department, job_title, phone, joining_date } =
      req.body;

    if (!name || !email || !role_id || !department || !job_title) {
      return res.status(400).json({
        message: "name, email, role_id, department and job_title are required",
      });
    }

    const [employees] = await connection.execute(
      `SELECT user_id
       FROM employees
       WHERE id = ?`,
      [id],
    );

    if (employees.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const userId = employees[0].user_id;

    const [existingUsers] = await connection.execute(
      `SELECT id
       FROM users
       WHERE email = ?
       AND id != ?`,
      [email, userId],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE id = ?",
      [role_id],
    );

    if (roles.length === 0) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    await connection.beginTransaction();

    await connection.execute(
      `UPDATE users
       SET name = ?,
           email = ?,
           role_id = ?
       WHERE id = ?`,
      [name, email, role_id, userId],
    );

    await connection.execute(
      `UPDATE employees
       SET department = ?,
           job_title = ?,
           phone = ?,
           joining_date = ?
       WHERE id = ?`,
      [department, job_title, phone || null, joining_date || null, id],
    );

    await connection.commit();

    res.json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to update employee",
    });
  } finally {
    connection.release();
  }
};

const deleteEmployee = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [employees] = await connection.execute(
      `SELECT user_id
       FROM employees
       WHERE id = ?`,
      [id],
    );

    if (employees.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const userId = employees[0].user_id;

    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM employees
       WHERE id = ?`,
      [id],
    );

    await connection.execute(
      `DELETE FROM users
       WHERE id = ?`,
      [userId],
    );

    await connection.commit();

    res.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to delete employee",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
