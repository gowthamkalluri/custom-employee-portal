const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/audit-logs", auditRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Custom Employee Portal API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const pool = require("./config/db");

pool
  .getConnection()
  .then((connection) => {
    console.log("MySQL connected successfully");
    connection.release();
  })
  .catch((error) => {
    console.error("MySQL connection failed:", error.message);
  });
