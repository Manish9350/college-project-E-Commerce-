import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import "./admin.css";
import toast from "react-hot-toast";
import { useApp } from "../context/AppContext";
import API_BASE_URL from "../config/api";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current)
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      const { token, user } = response.data;

      if (!user.isAdmin) {
        toast.error("Not an admin account");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch({ type: "SET_USER", payload: user });
      toast.success("Admin login successful");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container" ref={cardRef}>
      <div className="admin-header">
        <h2 className="admin-title">Admin Login</h2>
      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        <button className="admin-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Don't have an admin account? <Link to="/admin/register">Register</Link>
      </p>
    </div>
  );
};

export default AdminLogin;
