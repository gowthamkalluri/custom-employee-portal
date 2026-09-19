import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingPermission, setEditingPermission] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingPermissionId, setDeletingPermissionId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPermissions = async () => {
    try {
      setError("");

      const response = await api.get("/permissions");
      setPermissions(response.data.permissions);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleCreatePermission = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.post("/permissions", {
        name,
        description,
      });

      setSuccess("Permission created successfully.");

      setName("");
      setDescription("");

      await fetchPermissions();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create permission");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setEditName(permission.name);
    setEditDescription(permission.description || "");

    setError("");
    setSuccess("");
  };

  const handleUpdatePermission = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await api.put(`/permissions/${editingPermission.id}`, {
        name: editName,
        description: editDescription,
      });

      setSuccess("Permission updated successfully.");

      setEditingPermission(null);
      setEditName("");
      setEditDescription("");

      await fetchPermissions();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update permission");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (permission) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the "${permission.name}" permission?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingPermissionId(permission.id);

    try {
      await api.delete(`/permissions/${permission.id}`);

      setSuccess("Permission deleted successfully.");

      await fetchPermissions();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete permission");
    } finally {
      setDeletingPermissionId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Permission Management</h1>
          <p>Create and manage permissions in the employee portal.</p>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="info-card">
          <h2>Create Permission</h2>

          <form onSubmit={handleCreatePermission} className="admin-form">
            <div className="form-group">
              <label>Permission Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. export_reports"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this permission allows"
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Permission"}
            </button>
          </form>
        </div>

        {editingPermission && (
          <div className="info-card">
            <h2>Edit Permission</h2>

            <form onSubmit={handleUpdatePermission} className="admin-form">
              <div className="form-group">
                <label>Permission Name</label>

                <input
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Update Permission"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingPermission(null)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="info-card">
          <h2>Permissions</h2>

          {loading ? (
            <p>Loading permissions...</p>
          ) : permissions.length === 0 ? (
            <div className="empty-state">
              <p>No permissions found.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Permission</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td>{permission.id}</td>
                      <td>{permission.name}</td>
                      <td>{permission.description || "-"}</td>

                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(permission)}
                          disabled={submitting || deletingPermissionId !== null}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(permission)}
                          disabled={
                            submitting || deletingPermissionId === permission.id
                          }
                        >
                          {deletingPermissionId === permission.id
                            ? "Deleting..."
                            : "Delete"}
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

export default PermissionManagement;
