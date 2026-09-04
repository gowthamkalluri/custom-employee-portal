const pool = require("../config/db");

const getEmployees = async (req, res) => {
  try {
    const [employees] = await pool.execute(`
      SELECT
        e.id,
        u.name,
        u.email,
        e.department,
        e.job_title,
        e.phone,
        e.joining_date
      FROM employees e
      JOIN users u ON e.user_id = u.id
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
  try {
    const { user_id, department, job_title, phone, joining_date } = req.body;

    if (!user_id || !department || !job_title) {
      return res.status(400).json({
        message: "user_id, department and job_title are required",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO employees
       (user_id, department, job_title, phone, joining_date)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, department, job_title, phone || null, joining_date || null],
    );

    res.status(201).json({
      message: "Employee created successfully",
      employeeId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create employee",
    });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
};
