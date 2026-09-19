import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setError("");

      const response = await api.get("/admin/stats");
      setStats(response.data.stats);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load admin dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <p>Loading admin dashboard...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <p className="error-message">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your employee portal and system access.</p>
        </div>

        <div className="admin-stats-grid">
          <div className="info-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="info-card">
            <h3>Total Roles</h3>
            <p>{stats.totalRoles}</p>
          </div>

          <div className="info-card">
            <h3>Total Permissions</h3>
            <p>{stats.totalPermissions}</p>
          </div>

          <div className="info-card">
            <h3>Total Employees</h3>
            <p>{stats.totalEmployees}</p>
          </div>

          <div className="info-card">
            <h3>Pending Leaves</h3>
            <p>{stats.pendingLeaves}</p>
          </div>

          <div className="info-card">
            <h3>Approved Leaves</h3>
            <p>{stats.approvedLeaves}</p>
          </div>
        </div>

        <div className="admin-management-grid">
          <div className="info-card">
            <h2>User Management</h2>
            <p>Create, edit and manage portal users.</p>
            <Link to="/admin/users" className="primary-button">
              Manage Users
            </Link>
          </div>

          <div className="info-card">
            <h2>Role Management</h2>
            <p>Create roles and assign permissions.</p>
            <Link to="/admin/roles" className="primary-button">
              Manage Roles
            </Link>
          </div>

          <div className="info-card">
            <h2>Permission Management</h2>
            <p>Manage system permissions and access.</p>
            <Link to="/admin/permissions" className="primary-button">
              Manage Permissions
            </Link>
          </div>

          <div className="info-card">
            <h2>Audit Logs</h2>
            <p>Monitor user activity and system access.</p>
            <Link to="/admin/logs" className="primary-button">
              View Logs
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
