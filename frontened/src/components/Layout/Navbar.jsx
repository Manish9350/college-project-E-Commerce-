import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import styled from "styled-components";
import { useApp } from "../../context/AppContext";

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 1000;
  padding: 0 20px;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;

  &:hover {
    color: #764ba2;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: ${(props) =>
      props.$isOpen ? "flex" : "none"}; // Changed to $isOpen
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
  }
`;

const NavLink = styled(Link)`
  color: #4a5568;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;

  &:hover {
    color: #667eea;
  }

  &.active::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: #667eea;
  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  color: #4a5568;
  transition: color 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthButton = styled(Link)`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;

  &.login {
    color: #4a5568;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f7fafc;
    }
  }

  &.register {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid #e53e3e;
  color: #e53e3e;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e53e3e;
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #4a5568;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = ({ onCartToggle }) => {
  const { user, cart, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Renamed state
  const navigate = useNavigate();

  useEffect(() => {
    // Navbar entrance animation
    gsap.fromTo(
      ".navbar",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "SET_USER", payload: null });
    dispatch({ type: "CLEAR_CART" });
    navigate("/");
    setMobileMenuOpen(false); // Close mobile menu on logout
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || "U";
  };

  const handleNavLinkClick = () => {
    closeMobileMenu();
  };

  return (
    <NavbarContainer className="navbar">
      <NavContent>
        <Logo to="/" onClick={handleNavLinkClick}>
          Shoplify
        </Logo>

        {/* Use $isOpen instead of isOpen for styled-components */}
        <NavLinks $isOpen={mobileMenuOpen}>
          <NavLink to="/" onClick={handleNavLinkClick}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={handleNavLinkClick}>
            Products
          </NavLink>
          {user && (
            <NavLink to="/orders" onClick={handleNavLinkClick}>
              Orders
            </NavLink>
          )}
          {user?.isAdmin && (
            <NavLink to="/admin" onClick={handleNavLinkClick}>
              Admin
            </NavLink>
          )}
          {user?.isAdmin && (
            <NavLink to="/admin/orders" onClick={handleNavLinkClick}>
              Admin Orders
            </NavLink>
          )}
        </NavLinks>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <CartButton onClick={onCartToggle}>
            🛒
            {cartItemCount > 0 && <CartCount>{cartItemCount}</CartCount>}
          </CartButton>

          {user ? (
            <UserMenu>
              <NavLink to="/profile" onClick={handleNavLinkClick}>
                <UserAvatar>{getUserInitial()}</UserAvatar>
              </NavLink>
              {user?.isAdmin && (
                <NavLink to="/admin/profile" onClick={handleNavLinkClick}>
                  Admin Profile
                </NavLink>
              )}
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </UserMenu>
          ) : (
            <AuthSection>
              <AuthButton
                to="/login"
                className="login"
                onClick={handleNavLinkClick}
              >
                Login
              </AuthButton>
              <AuthButton
                to="/register"
                className="register"
                onClick={handleNavLinkClick}
              >
                Sign Up
              </AuthButton>
            </AuthSection>
          )}

          <MobileMenuButton onClick={toggleMobileMenu}>
            {mobileMenuOpen ? "✕" : "☰"}
          </MobileMenuButton>
        </div>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
