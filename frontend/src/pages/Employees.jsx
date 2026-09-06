import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [profile, setProfile] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("4");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setProfile(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      setError("");

      const response = await api.get("/employees");
      setEmployees(response.data.employees);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchEmployees();
  }, []);

  const canManageEmployees =
    profile?.role === "Admin" || profile?.role === "HR";

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRoleId("4");
    setDepartment("");
    setJobTitle("");
    setPhone("");
    setJoiningDate("");
    setEditingEmployee(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const employeeData = {
      name,
      email,
      password,
      role_id: Number(roleId),
      department,
      job_title: jobTitle,
      phone,
      joining_date: joiningDate,
    };

    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, employeeData);

        setSuccess("Employee updated successfully.");
      } else {
        await api.post("/employees", employeeData);

        setSuccess("Employee created successfully.");
      }

      resetForm();
      fetchEmployees();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save employee");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);

    setName(employee.name || "");
    setEmail(employee.email || "");
    setRoleId(String(employee.role_id || "4"));
    setPassword("");
    setDepartment(employee.department || "");
    setJobTitle(employee.job_title || "");
    setPhone(employee.phone || "");
    setJoiningDate(
      employee.joining_date ? employee.joining_date.substring(0, 10) : "",
    );

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(`/employees/${id}`);

      setSuccess("Employee deleted successfully.");

      fetchEmployees();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="page-header employee-header">
          <div>
            <h1>Employees</h1>
            <p>View and manage employees.</p>
          </div>

          {canManageEmployees && (
            <button
              className="primary-button"
              onClick={() => {
                setShowForm(!showForm);
                setEditingEmployee(null);
                setError("");
                setSuccess("");

                if (showForm) {
                  resetForm();
                }
              }}
            >
              {showForm ? "Cancel" : "+ Add Employee"}
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        {success && <p className="success-message">{success}</p>}

        {/* Create / Edit Employee Form */}
        {showForm && canManageEmployees && (
          <div className="employee-form-card">
            <h2>{editingEmployee ? "Edit Employee" : "Add Employee"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="employee-form-grid">
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

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!editingEmployee}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                  >
                    <option value="4">Employee</option>
                    <option value="3">Manager</option>
                    <option value="2">HR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>

                  <input
                    id="department"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="jobTitle">Job Title</label>

                  <input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>

                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="joiningDate">Joining Date</label>

                  <input
                    id="joiningDate"
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="primary-button">
                {editingEmployee ? "Update Employee" : "Create Employee"}
              </button>
            </form>
          </div>
        )}

        {/* Employee List */}
        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Job Title</th>
                  <th>Phone</th>
                  <th>Joining Date</th>

                  {canManageEmployees && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.job_title}</td>
                    <td>{employee.phone || "-"}</td>
                    <td>{employee.joining_date || "-"}</td>

                    {canManageEmployees && (
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </button>
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

export default Employees;
