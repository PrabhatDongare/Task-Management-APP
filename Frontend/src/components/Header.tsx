import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between border-b-2 px-10 py-2 text-lg font-medium">
      <ul className="flex gap-5">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/tasklist">Task list</Link>
        </li>
      </ul>
      {localStorage.getItem("token") && (
        <button onClick={handleLogout} className="text-violet-500">
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
