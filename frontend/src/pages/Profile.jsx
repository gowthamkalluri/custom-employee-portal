import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");

      const user = response.data.user;

      setProfile(user);
      setName(user.name);
      setEmail(user.email);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await api.put("/auth/profile", {
        name,
        email,
      });

      setSuccess("Profile updated successfully!");

      await fetchProfile();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (error && !profile) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p className="error-message">{error}</p>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p>Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>View and update your profile information.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {success && <p className="success-message">{success}</p>}

        <div className="profile-grid">
          {/* Profile Information */}
          <div className="info-card profile-card">
            <h2>Profile Information</h2>

            <div className="profile-detail">
              <span>Name</span>
              <strong>{profile.name}</strong>
            </div>

            <div className="profile-detail">
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>

            <div className="profile-detail">
              <span>Role</span>
              <strong>{profile.role}</strong>
            </div>

            <div className="profile-detail">
              <span>Department</span>
              <strong>{profile.department || "Not assigned"}</strong>
            </div>

            <div className="profile-detail">
              <span>Job Title</span>
              <strong>{profile.job_title || "Not assigned"}</strong>
            </div>

            <div className="profile-detail">
              <span>Phone</span>
              <strong>{profile.phone || "Not assigned"}</strong>
            </div>

            <div className="profile-detail">
              <span>Joining Date</span>
              <strong>{profile.joining_date || "Not assigned"}</strong>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="info-card profile-card">
            <h2>Edit Profile</h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="name">Name</label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="primary-button">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
