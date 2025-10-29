import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';

const CartContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : '-400px'}; // Changed to $isOpen
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: 100vw;
  }
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f1f1;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 15px;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  div {
    font-size: 48px;
    margin-bottom: 10px;
  }
`;

const Cart = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleIncreaseQuantity = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  return (
    // Use $isOpen instead of isOpen
    <CartContainer $isOpen={isOpen}>
      <CartHeader>
        <h2 style={{ margin: 0 }}>Shopping Cart</h2>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
            padding: '5px'
          }}
        >
          ✕
        </button>
      </CartHeader>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {cart.length === 0 ? (
          <EmptyCart>
            <div>🛒</div>
            <p>Your cart is empty</p>
          </EmptyCart>
        ) : (
          cart.map(item => (
            <CartItem key={item.product._id}>
              <img 
                src={item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder.jpg'} 
                alt={item.product.name}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'cover', 
                  borderRadius: '8px' 
                }}
              />
              <div style={{ flex: 1, marginLeft: '15px' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                  {item.product.name}
                </h4>
                <p style={{ margin: 0, color: '#667eea', fontWeight: '600' }}>
                  ${item.product.price}
                </p>
              </div>
              <QuantityControl>
                <QuantityButton 
                  onClick={() => handleDecreaseQuantity(item.product._id, item.quantity)}
                  disabled={item.quantity <= 1}
                >
                  -
                </QuantityButton>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                  {item.quantity}
                </span>
                <QuantityButton 
                  onClick={() => handleIncreaseQuantity(item.product._id, item.quantity)}
                >
                  +
                </QuantityButton>
              </QuantityControl>
              <button 
                onClick={() => removeFromCart(item.product._id)}
                style={{ 
                  marginLeft: '15px', 
                  color: '#e74c3c',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '5px'
                }}
                aria-label="Remove item"
              >
                🗑️
              </button>
            </CartItem>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '20px' 
          }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <CheckoutButton onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutButton>
        </div>
      )}
    </CartContainer>
  );
};

export default Cart;