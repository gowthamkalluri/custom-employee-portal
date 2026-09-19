import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      user = payload;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Employee Portal</div>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>

        {(role === "Admin" || role === "HR" || role === "Manager") && (
          <Link to="/employees">Employees</Link>
        )}

        <Link to="/leaves">Leaves</Link>

        {role === "Admin" && <Link to="/admin">Admin Dashboard</Link>}

        <Link to="/profile">Profile</Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
