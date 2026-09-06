import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Leaves from "./pages/Leaves";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RoleManagement from "./pages/RoleManagement";
import PermissionManagement from "./pages/PermissionManagement";
import AuditLogs from "./pages/AuditLogs";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProtectedRoute>
              <Leaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute>
              <RoleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/permissions"
          element={
            <ProtectedRoute>
              <PermissionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
