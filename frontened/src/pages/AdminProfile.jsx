import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./admin.css";

const AdminProfile = () => {
  const { user, dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "SET_USER", payload: null });
    navigate("/");
  };

  if (!user?.isAdmin) return <p className="admin-container">Access denied.</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Profile</h1>
        <div className="admin-actions">
          <button className="admin-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> Admin
        </p>
      </div>
    </div>
  );
};

export default AdminProfile;
