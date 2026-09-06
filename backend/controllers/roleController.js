const pool = require("../config/db");
const createAuditLog = require("../utils/auditLogger");

const getRoles = async (req, res) => {
  try {
    const [roles] = await pool.execute(`
      SELECT
        id,
        name,
        description
      FROM roles
      ORDER BY id ASC
    `);

    res.json({ roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Role name is required",
      });
    }

    const [existingRoles] = await pool.execute(
      "SELECT id FROM roles WHERE name = ?",
      [name],
    );

    if (existingRoles.length > 0) {
      return res.status(409).json({
        message: "A role with this name already exists",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO roles (name, description)
       VALUES (?, ?)`,
      [name, description || null],
    );

    await createAuditLog({
      userId: req.user.userId,
      action: "CREATE",
      resource: "ROLE",
      resourceId: result.insertId,
      details: `Created role ${name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "Role created successfully",
      roleId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create role",
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Role name is required",
      });
    }

    const [roles] = await pool.execute("SELECT id FROM roles WHERE id = ?", [
      id,
    ]);

    if (roles.length === 0) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const [existingRoles] = await pool.execute(
      `SELECT id
       FROM roles
       WHERE name = ?
       AND id != ?`,
      [name, id],
    );

    if (existingRoles.length > 0) {
      return res.status(409).json({
        message: "A role with this name already exists",
      });
    }

    await pool.execute(
      `UPDATE roles
       SET name = ?,
           description = ?
       WHERE id = ?`,
      [name, description || null, id],
    );

    await createAuditLog({
      userId: req.user.userId,
      action: "UPDATE",
      resource: "ROLE",
      resourceId: id,
      details: `Updated role ${name}`,
      ipAddress: req.ip,
    });

    res.json({
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update role",
    });
  }
};

const deleteRole = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    // Prevent deletion of the default system roles.
    if ([1, 2, 3, 4, 8].includes(Number(id))) {
      return res.status(400).json({
        message: "Default system roles cannot be deleted",
      });
    }

    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE id = ?",
      [id],
    );

    if (roles.length === 0) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const [users] = await connection.execute(
      "SELECT COUNT(*) AS count FROM users WHERE role_id = ?",
      [id],
    );

    if (users[0].count > 0) {
      return res.status(400).json({
        message: "Cannot delete a role assigned to users",
      });
    }

    await connection.beginTransaction();

    await connection.execute("DELETE FROM role_permissions WHERE role_id = ?", [
      id,
    ]);

    await connection.execute("DELETE FROM roles WHERE id = ?", [id]);

    await connection.commit();

    await createAuditLog({
      userId: req.user.userId,
      action: "DELETE",
      resource: "ROLE",
      resourceId: id,
      details: `Deleted role ${id}`,
      ipAddress: req.ip,
    });

    res.json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.status(500).json({
      message: "Failed to delete role",
    });
  } finally {
    connection.release();
  }
};

const getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;

    const [roles] = await pool.execute("SELECT id FROM roles WHERE id = ?", [
      id,
    ]);

    if (roles.length === 0) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const [permissions] = await pool.execute(
      `
      SELECT
        p.id,
        p.name,
        p.description
      FROM permissions p
      JOIN role_permissions rp
        ON p.id = rp.permission_id
      WHERE rp.role_id = ?
      ORDER BY p.id ASC
      `,
      [id],
    );

    res.json({ permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch role permissions",
    });
  }
};

const updateRolePermissions = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { permission_ids } = req.body;

    if (!Array.isArray(permission_ids)) {
      return res.status(400).json({
        message: "permission_ids must be an array",
      });
    }

    const [roles] = await connection.execute(
      "SELECT id FROM roles WHERE id = ?",
      [id],
    );

    if (roles.length === 0) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    if (permission_ids.length > 0) {
      const placeholders = permission_ids.map(() => "?").join(",");

      const [permissions] = await connection.execute(
        `SELECT id
         FROM permissions
         WHERE id IN (${placeholders})`,
        permission_ids,
      );

      if (permissions.length !== permission_ids.length) {
        return res.status(400).json({
          message: "One or more invalid permission IDs",
        });
      }
    }

    await connection.beginTransaction();

    // Remove the role's existing permissions.
    await connection.execute("DELETE FROM role_permissions WHERE role_id = ?", [
      id,
    ]);

    // Add the newly selected permissions.
    if (permission_ids.length > 0) {
      const values = permission_ids.map((permissionId) => [id, permissionId]);

      await connection.query(
        `INSERT INTO role_permissions
         (role_id, permission_id)
         VALUES ?`,
        [values],
      );
    }

    await connection.commit();

    await createAuditLog({
      userId: req.user.userId,
      action: "UPDATE",
      resource: "ROLE_PERMISSIONS",
      resourceId: id,
      details: `Updated permissions for role ${id}`,
      ipAddress: req.ip,
    });

    res.json({ message: "Role permissions updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.status(500).json({
      message: "Failed to update role permissions",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getRoles,
  createRole,
  updateRole,
  getRolePermissions,
  updateRolePermissions,
  deleteRole,
};
