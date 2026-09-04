const pool = require("../config/db");
const { get } = require("../routes/employeeRoutes");

const applyLeave = async (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;

    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({
        message: "leave_type, start_date and end_date are required",
      });
    }

    if (new Date(end_date) < new Date(start_date)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const [employees] = await pool.execute(
      `SELECT id
       FROM employees
       WHERE user_id = ?`,
      [req.user.userId],
    );

    if (employees.length === 0) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    const employeeId = employees[0].id;

    const [result] = await pool.execute(
      `INSERT INTO leaves
       (employee_id, leave_type, start_date, end_date, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [employeeId, leave_type, start_date, end_date, reason || null],
    );

    res.status(201).json({
      message: "Leave applied successfully",
      leaveId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to apply leave",
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    let leaves;

    if (req.user.role === "Employee") {
      // Employee can see only their own leaves
      [leaves] = await pool.execute(
        `SELECT
          l.id,
          l.employee_id,
          u.name AS employee_name,
          l.leave_type,
          l.start_date,
          l.end_date,
          l.reason,
          l.status,
          l.created_at
         FROM leaves l
         JOIN employees e ON l.employee_id = e.id
         JOIN users u ON e.user_id = u.id
         WHERE e.user_id = ?
         ORDER BY l.created_at DESC`,
        [req.user.userId],
      );
    } else {
      // Admin, HR and Manager can view all leaves
      [leaves] = await pool.execute(`
        SELECT
          l.id,
          l.employee_id,
          u.name AS employee_name,
          l.leave_type,
          l.start_date,
          l.end_date,
          l.reason,
          l.status,
          l.created_at
        FROM leaves l
        JOIN employees e ON l.employee_id = e.id
        JOIN users u ON e.user_id = u.id
        ORDER BY l.created_at DESC
      `);
    }

    res.json({
      leaves,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch leaves",
    });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const [leaves] = await pool.execute(
      `SELECT status
   FROM leaves
   WHERE id = ?`,
      [id],
    );

    if (leaves.length === 0) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    if (leaves[0].status !== "Pending") {
      return res.status(400).json({
        message: "Only pending leave requests can be updated",
      });
    }

    const [result] = await pool.execute(
      `UPDATE leaves
       SET status = ?
       WHERE id = ?`,
      [status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update leave status",
    });
  }
};

module.exports = {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
};
