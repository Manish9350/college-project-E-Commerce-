import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import styled from "styled-components";
import toast from "react-hot-toast";
import API_BASE_URL from "../config/api";
import "./admin.css";

const Container = styled.div`
  padding: 40px;
  max-width: 480px;
  margin: 60px auto;
`;

const AdminRegister = () => {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
      // adminCode must be provided by the person creating admin accounts
      await axios.post(`${API_BASE_URL}/auth/register-admin`, data);
      toast.success("Admin account created. Please login.");
      navigate("/admin/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container" ref={cardRef}>
      <div className="admin-header">
        <h2 className="admin-title">Admin Register</h2>
      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input {...register("name", { required: true })} placeholder="Name" />
        <input {...register("email", { required: true })} placeholder="Email" />
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
        />
        <input
          {...register("adminCode", { required: true })}
          placeholder="Admin Code"
        />
        <button className="admin-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
