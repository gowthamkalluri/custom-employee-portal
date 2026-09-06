const pool = require("../config/db");

const getPermissions = async (req, res) => {
  try {
    const [permissions] = await pool.execute(`
      SELECT
        id,
        name,
        description
      FROM permissions
      ORDER BY id ASC
    `);

    res.json({ permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch permissions",
    });
  }
};

const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Permission name is required",
      });
    }

    const [existingPermissions] = await pool.execute(
      "SELECT id FROM permissions WHERE name = ?",
      [name],
    );

    if (existingPermissions.length > 0) {
      return res.status(409).json({
        message: "A permission with this name already exists",
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO permissions (name, description)
       VALUES (?, ?)`,
      [name, description || null],
    );

    res.status(201).json({
      message: "Permission created successfully",
      permissionId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create permission",
    });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Permission name is required",
      });
    }

    const [permissions] = await pool.execute(
      "SELECT id FROM permissions WHERE id = ?",
      [id],
    );

    if (permissions.length === 0) {
      return res.status(404).json({
        message: "Permission not found",
      });
    }

    const [existingPermissions] = await pool.execute(
      `SELECT id
       FROM permissions
       WHERE name = ?
       AND id != ?`,
      [name, id],
    );

    if (existingPermissions.length > 0) {
      return res.status(409).json({
        message: "A permission with this name already exists",
      });
    }

    await pool.execute(
      `UPDATE permissions
       SET name = ?,
           description = ?
       WHERE id = ?`,
      [name, description || null, id],
    );

    res.json({
      message: "Permission updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update permission",
    });
  }
};

const deletePermission = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [permissions] = await connection.execute(
      "SELECT id FROM permissions WHERE id = ?",
      [id],
    );

    if (permissions.length === 0) {
      return res.status(404).json({
        message: "Permission not found",
      });
    }

    await connection.beginTransaction();

    await connection.execute(
      "DELETE FROM role_permissions WHERE permission_id = ?",
      [id],
    );

    await connection.execute("DELETE FROM permissions WHERE id = ?", [id]);

    await connection.commit();

    res.json({
      message: "Permission deleted successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.status(500).json({
      message: "Failed to delete permission",
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
};
