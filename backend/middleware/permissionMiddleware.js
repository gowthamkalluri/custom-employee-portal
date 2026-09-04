const pool = require("../config/db");

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      const [permissions] = await pool.execute(
        `SELECT p.name
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         WHERE rp.role_id = ?
         AND p.name = ?`,
        [req.user.roleId, requiredPermission]
      );

      if (permissions.length === 0) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Authorization check failed",
      });
    }
  };
};

module.exports = permissionMiddleware;