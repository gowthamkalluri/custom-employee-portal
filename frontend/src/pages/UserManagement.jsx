import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("4");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRoleId, setEditRoleId] = useState("4");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      await api.post("/users", {
        name,
        email,
        password,
        role_id: Number(roleId),
      });

      setSuccess("User created successfully.");

      setName("");
      setEmail("");
      setPassword("");
      setRoleId("4");

      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRoleId(String(user.role_id));

    setError("");
    setSuccess("");
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      await api.put(`/users/${editingUser.id}`, {
        name: editName,
        email: editEmail,
        role_id: Number(editRoleId),
      });

      setSuccess("User updated successfully.");

      setEditingUser(null);
      setEditName("");
      setEditEmail("");
      setEditRoleId("4");

      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/users/${user.id}`);

      setSuccess("User deleted successfully.");

      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>User Management</h1>
          <p>Create, edit and manage portal users.</p>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="info-card">
          <h2>Create User</h2>

          <form onSubmit={handleCreateUser} className="admin-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                value={roleId}
                onChange={(event) => setRoleId(event.target.value)}
                required
              >
                <option value="8">Finance</option>
                <option value="4">Support</option>
                <option value="3">Sales</option>
                <option value="2">HR</option>
                <option value="1">Admin</option>
              </select>
            </div>

            <button type="submit" className="primary-button">
              Create User
            </button>
          </form>
        </div>

        {editingUser && (
          <div className="info-card">
            <h2>Edit User</h2>

            <form onSubmit={handleUpdateUser} className="admin-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(event) => setEditEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>

                <select
                  value={editRoleId}
                  onChange={(event) => setEditRoleId(event.target.value)}
                  required
                >
                  <option value="8">Finance</option>
                  <option value="4">Support</option>
                  <option value="3">Sales</option>
                  <option value="2">HR</option>
                  <option value="1">Admin</option>
                </select>
              </div>

              <div>
                <button type="submit" className="primary-button">
                  Update User
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="info-card">
          <h2>Users</h2>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default UserManagement;
