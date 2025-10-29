import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { gsap } from 'gsap';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    animation: float 20s infinite linear;
  }

  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-50px, -50px) rotate(360deg); }
  }
`;

const AuthCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.1);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.error ? '#e74c3c' : '#e1e5e9'};
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }

  &:active::after {
    width: 100%;
    height: 100%;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
  display: block;
  font-weight: 500;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 25px 0;
  color: #a0aec0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e1e5e9;
  }

  span {
    padding: 0 15px;
    font-size: 14px;
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    border-color: #667eea;
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

const ForgotPassword = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
  text-align: center;
  display: block;
  margin-top: -10px;

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`;

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useApp();
  const cardRef = useRef();

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Enhanced animation for login page
    const tl = gsap.timeline();
    
    // Background animation
    tl.fromTo('.auth-bg', 
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
    );
    
    // Card animation
    tl.fromTo(cardRef.current,
      { 
        opacity: 0, 
        y: 50, 
        scale: 0.9,
        rotationX: 10 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotationX: 0, 
        duration: 1, 
        ease: "back.out(1.7)" 
      },
      "-=0.5"
    );

    // Input animations
    tl.fromTo('.form-input',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.6 },
      "-=0.3"
    );
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update global state
      dispatch({ type: 'SET_USER', payload: user });
      
      // Show success message
      toast.success(`Welcome back, ${user.name}!`, {
        icon: '👋',
        style: {
          background: '#4CAF50',
          color: 'white',
        },
      });

      // Redirect to previous page or home
      navigate(from, { replace: true });
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      toast.error(errorMessage, {
        style: {
          background: '#e74c3c',
          color: 'white',
        },
      });
      
      // Shake animation on error
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x: 10,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "power1.inOut"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Auto-fill demo credentials
    const demoCredentials = {
      email: 'demo@example.com',
      password: 'demo123'
    };
    
    // You can submit these directly or pre-fill the form
    onSubmit(demoCredentials);
  };

  return (
    <AuthContainer className="auth-bg">
      <AuthCard ref={cardRef}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0', 
            color: '#2d3748', 
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Welcome Back
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#718096', 
            fontSize: '16px' 
          }}>
            Sign in to your account to continue
          </p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <InputGroup>
            <Input
              type="email"
              placeholder="Enter your email"
              className="form-input"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              error={errors.email}
            />
            {errors.email && (
              <ErrorMessage>
                📧 {errors.email.message}
              </ErrorMessage>
            )}
          </InputGroup>

          {/* Password Input */}
          <InputGroup>
            <Input
              type="password"
              placeholder="Enter your password"
              className="form-input"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password}
            />
            {errors.password && (
              <ErrorMessage>
                🔒 {errors.password.message}
              </ErrorMessage>
            )}
          </InputGroup>

          {/* Forgot Password */}
          <ForgotPassword to="/forgot-password">
            Forgot your password?
          </ForgotPassword>

          {/* Login Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Signing In...
              </>
            ) : (
              <>
                <span style={{ marginRight: '8px' }}>🔑</span>
                Sign In
              </>
            )}
          </Button>

          {/* Divider */}
          <Divider>
            <span>Or continue with</span>
          </Divider>

          {/* Demo Login Button */}
          <SocialButton type="button" onClick={handleDemoLogin} disabled={isLoading}>
            <span>🎮</span>
            Try Demo Account
          </SocialButton>

          {/* Social Login Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <SocialButton type="button">
              <span>📘</span>
              Facebook
            </SocialButton>
            <SocialButton type="button">
              <span>📱</span>
              Google
            </SocialButton>
          </div>
        </Form>

        {/* Sign Up Link */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '1px solid #e1e5e9' 
        }}>
          <p style={{ margin: 0, color: '#718096' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#667eea', 
                fontWeight: '600',
                textDecoration: 'none'
              }}
              state={{ from: location.state?.from }}
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '12px', 
            color: '#667eea',
            fontWeight: '500'
          }}>
            💡 Demo: demo@example.com / demo123
          </p>
        </div>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;