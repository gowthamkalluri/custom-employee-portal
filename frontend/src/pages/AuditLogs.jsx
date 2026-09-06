import { useEffect, useState } from "react";
import api from "../api/api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      const response = await api.get("/audit-logs");
      setLogs(response.data.logs);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load audit logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="page-container">
      <h1>Activity Logs</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Details</th>
              <th>IP Address</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6">No activity logs found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>

                  <td>
                    {log.user_name || "Unknown"}
                    <br />
                    <small>{log.user_email || ""}</small>
                  </td>

                  <td>
                    <span
                      className={`audit-action ${log.action.toLowerCase()}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td>
                    {log.resource}
                    {log.resource_id ? ` #${log.resource_id}` : ""}
                  </td>

                  <td>{log.details || "-"}</td>

                  <td>{log.ip_address || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
