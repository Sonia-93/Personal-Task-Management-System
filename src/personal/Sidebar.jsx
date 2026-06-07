import { NavLink, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaTasks, FaSignOutAlt } from "react-icons/fa";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">📚</span>
        <span className="sidebar-logo-text">PTMs</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-active" : "")}
        >
          <FaTachometerAlt className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-active" : "")}
        >
          <FaTasks className="sidebar-icon" />
          <span>My Tasks</span>
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <FaSignOutAlt className="sidebar-icon" />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
