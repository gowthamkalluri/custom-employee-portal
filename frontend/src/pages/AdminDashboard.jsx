import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data.stats);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load admin dashboard",
      );
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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

  if (!stats) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p>Loading admin dashboard...</p>
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

          <div className="info-card">
            <h2>Zoho Integration</h2>
            <p>Manage connected Zoho services.</p>
            <Link to="/admin/zoho" className="primary-button">
              Zoho Settings
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
