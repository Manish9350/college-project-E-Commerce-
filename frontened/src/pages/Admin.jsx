import React from "react";
import AdminOrders from "../components/AdminOrders";
import "./admin.css";

const Admin = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Panel — Orders</h1>
      </div>
      <AdminOrders />
    </div>
  );
};

export default Admin;
