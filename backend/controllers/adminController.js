const pool = require("../config/db");

const getAdminStats = async (req, res) => {
  try {
    const [users] = await pool.execute(
      "SELECT COUNT(*) AS totalUsers FROM users",
    );

    const [roles] = await pool.execute(
      "SELECT COUNT(*) AS totalRoles FROM roles",
    );

    const [permissions] = await pool.execute(
      "SELECT COUNT(*) AS totalPermissions FROM permissions",
    );

    const [employees] = await pool.execute(
      "SELECT COUNT(*) AS totalEmployees FROM employees",
    );

    res.json({
      stats: {
        totalUsers: users[0].totalUsers,
        totalRoles: roles[0].totalRoles,
        totalPermissions: permissions[0].totalPermissions,
        totalEmployees: employees[0].totalEmployees,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch admin statistics",
    });
  }
};

module.exports = {
  getAdminStats,
};
