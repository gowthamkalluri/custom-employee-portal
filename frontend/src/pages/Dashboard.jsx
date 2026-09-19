import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");

        const response = await api.get("/auth/profile");
        setProfile(response.data.user);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        {loading ? (
          <p>Loading dashboard...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="page-header">
              <h1>Welcome, {profile.name}!</h1>
              <p>Here's an overview of your employee profile.</p>
            </div>

            <div className="dashboard-grid">
              <div className="info-card">
                <h3>Role</h3>
                <p>{profile.role}</p>
              </div>

              <div className="info-card">
                <h3>Department</h3>
                <p>{profile.department || "Not assigned"}</p>
              </div>

              <div className="info-card">
                <h3>Job Title</h3>
                <p>{profile.job_title || "Not assigned"}</p>
              </div>

              <div className="info-card">
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Dashboard;
