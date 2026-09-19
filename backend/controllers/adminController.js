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

    const [pendingLeaves] = await pool.execute(
      "SELECT COUNT(*) AS pendingLeaves FROM leaves WHERE status = 'Pending'",
    );

    const [approvedLeaves] = await pool.execute(
      "SELECT COUNT(*) AS approvedLeaves FROM leaves WHERE status = 'Approved'",
    );

    res.json({
      stats: {
        totalUsers: users[0].totalUsers,
        totalRoles: roles[0].totalRoles,
        totalPermissions: permissions[0].totalPermissions,
        totalEmployees: employees[0].totalEmployees,
        pendingLeaves: pendingLeaves[0].pendingLeaves,
        approvedLeaves: approvedLeaves[0].approvedLeaves,
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
