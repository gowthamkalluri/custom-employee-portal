import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [profile, setProfile] = useState(null);

  const [leaveType, setLeaveType] = useState("Sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applying, setApplying] = useState(false);
  const [updatingLeaveId, setUpdatingLeaveId] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setProfile(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load profile");
    }
  };

  const fetchLeaves = async () => {
    try {
      setError("");

      const response = await api.get("/leaves");
      setLeaves(response.data.leaves);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setApplying(true);

    try {
      await api.post("/leaves", {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
      });

      setSuccess("Leave applied successfully.");

      setLeaveType("Sick");
      setStartDate("");
      setEndDate("");
      setReason("");

      await fetchLeaves();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to apply for leave");
    } finally {
      setApplying(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setError("");
    setSuccess("");
    setUpdatingLeaveId(id);

    try {
      await api.put(`/leaves/${id}/status`, {
        status,
      });

      setSuccess(`Leave ${status.toLowerCase()} successfully.`);

      await fetchLeaves();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update leave status",
      );
    } finally {
      setUpdatingLeaveId(null);
    }
  };

  const canManageLeaves =
    profile?.role === "Admin" ||
    profile?.role === "HR" ||
    profile?.role === "Manager";

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Leaves</h1>
          <p>Manage your leave requests and approvals.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {success && <p className="success-message">{success}</p>}

        <div className="leave-form-card">
          <h2>Apply for Leave</h2>

          <form onSubmit={handleApplyLeave}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="leaveType">Leave Type</label>

                <select
                  id="leaveType"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="Sick">Sick</option>
                  <option value="Casual">Casual</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason</label>

              <textarea
                id="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leave"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={applying}
            >
              {applying ? "Applying..." : "Apply Leave"}
            </button>
          </form>
        </div>

        <div className="page-header">
          <h2>Leave Requests</h2>
        </div>

        {loading ? (
          <p>Loading leaves...</p>
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <p>No leave requests found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>

                  {canManageLeaves && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employee_name}</td>
                    <td>{leave.leave_type}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.status}</td>

                    {canManageLeaves && (
                      <td>
                        {leave.status === "Pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(leave.id, "Approved")
                              }
                              disabled={updatingLeaveId === leave.id}
                            >
                              {updatingLeaveId === leave.id
                                ? "Updating..."
                                : "Approve"}
                            </button>

                            <button
                              onClick={() =>
                                handleStatusUpdate(leave.id, "Rejected")
                              }
                              disabled={updatingLeaveId === leave.id}
                            >
                              {updatingLeaveId === leave.id
                                ? "Updating..."
                                : "Reject"}
                            </button>
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default Leaves;
