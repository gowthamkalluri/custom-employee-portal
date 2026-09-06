const pool = require("../config/db");

const createAuditLog = async ({
  userId,
  action,
  resource,
  resourceId = null,
  details = null,
  ipAddress = null,
}) => {
  try {
    await pool.execute(
      `
      INSERT INTO audit_logs
      (user_id, action, resource, resource_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
      ],
    );
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};

module.exports = createAuditLog;