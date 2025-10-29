import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #1a202c;
  color: white;
  padding: 40px 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FooterSection = styled.div`
  h3 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 18px;
  }

  p {
    color: #a0aec0;
    line-height: 1.6;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  a {
    color: #a0aec0;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;

  a {
    color: #a0aec0;
    font-size: 20px;
    transition: color 0.3s ease;

    &:hover {
      color: #667eea;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #2d3748;
  color: #a0aec0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>ShopEasy</h3>
          <p>
            Your one-stop destination for all your shopping needs. 
            We provide high-quality products with excellent customer service.
          </p>
          <SocialLinks>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLinks>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Customer Service</h3>
          <FooterLinks>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Contact Info</h3>
          <p>📧 support@shopeasy.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>📍 123 Commerce St, City, State 12345</p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        &copy; 2024 ShopEasy. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;