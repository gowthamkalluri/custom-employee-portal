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

module.exports = {
  getEmployees,
};