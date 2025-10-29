import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast'; 
import styled, { createGlobalStyle } from 'styled-components';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Cart from './components/Cart/Cart';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #f8fafc;
    color: #334155;
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed navbar */
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/" />;
};

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // GSAP page transitions
  useEffect(() => {
    // Global GSAP configuration
    gsap.config({
      nullTargetWarn: false,
    });

    // Smooth page entrance animation
    const tl = gsap.timeline();
    tl.fromTo('body', 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  // Handle cart open/close
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <AppProvider>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Navbar onCartToggle={handleCartToggle} />
          
          <MainContent>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              
              {/* Auth Routes (only for non-logged in users) */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainContent>

          <Footer />
          
          {/* Cart Sidebar */}
          <Cart isOpen={isCartOpen} onClose={handleCartClose} />
          
          {/* Toast Notifications - Fixed import */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  background: '#10b981',
                  color: 'white',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: 'white',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#ef4444',
                },
              },
            }}
          />
        </AppContainer>
      </Router>
    </AppProvider>
  );
}

export default App;