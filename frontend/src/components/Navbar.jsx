import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Employee Portal</div>

      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/leaves">Leaves</Link>
        <Link to="/profile">Profile</Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
