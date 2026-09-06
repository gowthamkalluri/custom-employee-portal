const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
  try {
    const [logs] = await pool.execute(`
      SELECT
        a.id,
        a.user_id,
        u.name AS user_name,
        u.email AS user_email,
        a.action,
        a.resource,
        a.resource_id,
        a.details,
        a.ip_address,
        a.created_at
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);

    res.json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

module.exports = {
  getAuditLogs,
};
