import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const cardRef = useRef();

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, scale: 0.8, rotationY: 180 },
      { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: "back.out(1.7)" }
    );
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      dispatch({ type: 'SET_USER', payload: user });
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard ref={cardRef}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Welcome Back
        </h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            placeholder="Email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '14px' }}>{errors.email.message}</span>}

          <Input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '14px' }}>{errors.password.message}</span>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#667eea' }}>Sign up</Link>
          </p>
        </Form>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;