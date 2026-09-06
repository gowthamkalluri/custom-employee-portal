import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingRole, setEditingRole] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data.roles);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load roles");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreateRole = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      await api.post("/roles", {
        name,
        description,
      });

      setSuccess("Role created successfully.");

      setName("");
      setDescription("");

      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create role");
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setEditName(role.name);
    setEditDescription(role.description || "");

    setError("");
    setSuccess("");
  };

  const handleUpdateRole = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      await api.put(`/roles/${editingRole.id}`, {
        name: editName,
        description: editDescription,
      });

      setSuccess("Role updated successfully.");

      setEditingRole(null);
      setEditName("");
      setEditDescription("");

      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (role) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ${role.name} role?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/roles/${role.id}`);

      setSuccess("Role deleted successfully.");

      fetchRoles();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete role");
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get("/permissions");
      setPermissions(response.data.permissions);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load permissions");
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await api.get(`/roles/${roleId}/permissions`);

      setSelectedPermissions(
        response.data.permissions.map((permission) => permission.id),
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load role permissions",
      );
    }
  };

  const handleRoleSelection = async (event) => {
    const roleId = event.target.value;

    setSelectedRoleId(roleId);
    setError("");
    setSuccess("");

    if (!roleId) {
      setSelectedPermissions([]);
      return;
    }

    await fetchRolePermissions(roleId);
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }

      return [...current, permissionId];
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) {
      setError("Please select a role first.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.put(`/roles/${selectedRoleId}/permissions`, {
        permission_ids: selectedPermissions,
      });

      setSuccess("Role permissions updated successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update role permissions",
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <h1>Role Management</h1>
          <p>Create and manage roles in the employee portal.</p>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="info-card">
          <h2>Create Role</h2>

          <form onSubmit={handleCreateRole} className="admin-form">
            <div className="form-group">
              <label>Role Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <button type="submit" className="primary-button">
              Create Role
            </button>
          </form>
        </div>

        {editingRole && (
          <div className="info-card">
            <h2>Edit Role</h2>

            <form onSubmit={handleUpdateRole} className="admin-form">
              <div className="form-group">
                <label>Role Name</label>

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
                <button type="submit" className="primary-button">
                  Update Role
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingRole(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="info-card">
          <h2>Roles</h2>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Role</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>{role.description || "-"}</td>

                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(role)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(role)}
                        disabled={[1, 2, 3, 4, 8].includes(role.id)}
                        title={
                          [1, 2, 3, 4, 8].includes(role.id)
                            ? "Default roles cannot be deleted"
                            : "Delete role"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="info-card">
          <h2>Assign Permissions</h2>

          <div className="form-group">
            <label>Select Role</label>

            <select value={selectedRoleId} onChange={handleRoleSelection}>
              <option value="">Select a role</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRoleId && (
            <>
              <div className="permissions-list">
                {permissions.map((permission) => (
                  <label key={permission.id} className="permission-item">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                    />

                    <span>
                      <strong>{permission.name}</strong>

                      {permission.description && (
                        <small>{permission.description}</small>
                      )}
                    </span>
                  </label>
                ))}
              </div>

              <button
                className="primary-button"
                onClick={handleSavePermissions}
              >
                Save Permissions
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default RoleManagement;
