import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import CheckoutForm from '../components/Checkout/CheckoutForm';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 160px);
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e1e5e9;
    z-index: 1;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? '#667eea' : '#e1e5e9'};
  color: ${props => props.active ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 14px;
  color: ${props => props.active ? '#667eea' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  h2 {
    color: #666;
    margin-bottom: 20px;
  }
`;

const ContinueShoppingButton = styled.button`
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

const Checkout = () => {
  const { cart, user, clearCart } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('shipping');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && currentStep === 'shipping') {
      toast.error('Your cart is empty');
      navigate('/products');
    }
  }, [cart, navigate, currentStep]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
    }
  }, [user, navigate]);

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const handleOrderCreated = (createdOrder) => {
    setOrder(createdOrder);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('success');
    clearCart();
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', number: 1 },
    { id: 'payment', label: 'Payment', number: 2 },
    { id: 'success', label: 'Confirmation', number: 3 }
  ];

  if (currentStep === 'success') {
    return (
      <CheckoutContainer>
        <CheckoutSection>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ color: '#28a745', marginBottom: '15px' }}>
              Order Confirmed!
            </h1>
            <p style={{ fontSize: '18px', marginBottom: '10px', color: '#666' }}>
              Thank you for your purchase!
            </p>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Your order has been successfully placed and will be shipped soon.
            </p>
            {order && (
              <div style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '10px',
                margin: '20px 0',
                display: 'inline-block'
              }}>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '14px' }}>
                  Order ID: <strong>{order._id}</strong>
                </p>
              </div>
            )}
            <div style={{ marginTop: '30px' }}>
              <ContinueShoppingButton onClick={() => navigate('/products')}>
                Continue Shopping
              </ContinueShoppingButton>
              <button 
                onClick={() => navigate('/orders')}
                style={{
                  marginLeft: '15px',
                  padding: '12px 30px',
                  background: 'transparent',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                View Orders
              </button>
            </div>
          </div>
        </CheckoutSection>
      </CheckoutContainer>
    );
  }

  if (cart.length === 0 && currentStep !== 'success') {
    return (
      <CheckoutContainer>
        <EmptyCartMessage>
          <h2>Your cart is empty</h2>
          <ContinueShoppingButton onClick={() => navigate('/products')}>
            Continue Shopping
          </ContinueShoppingButton>
        </EmptyCartMessage>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <h1 style={{ marginBottom: '30px' }}>Checkout</h1>
      
      <StepIndicator>
        {steps.map((step) => (
          <Step key={step.id}>
            <StepCircle 
              active={currentStep === step.id || 
                     (step.id === 'payment' && currentStep === 'success') ||
                     (step.id === 'shipping' && (currentStep === 'payment' || currentStep === 'success'))}
            >
              {step.number}
            </StepCircle>
            <StepLabel 
              active={currentStep === step.id || 
                     (step.id === 'payment' && currentStep === 'success') ||
                     (step.id === 'shipping' && (currentStep === 'payment' || currentStep === 'success'))}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </StepIndicator>

      <CheckoutContent>
        {/* Left Column - Checkout Form */}
        <div>
          <CheckoutSection>
            {currentStep === 'shipping' && (
              <CheckoutForm 
                onOrderCreated={handleOrderCreated}
                loading={loading}
              />
            )}
            
            {currentStep === 'payment' && order && (
              <div>
                <h2>Payment Method</h2>
                <p>Payment integration would go here...</p>
                {/* In a real app, you'd integrate Stripe Elements here */}
                <button 
                  onClick={handlePaymentSuccess}
                  style={{
                    padding: '15px 30px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  Complete Payment - ${total.toFixed(2)}
                </button>
              </div>
            )}
          </CheckoutSection>
        </div>

        {/* Right Column - Order Summary */}
        <OrderSummary>
          <h3 style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f1f1f1' }}>
            Order Summary
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            {cart.map(item => (
              <div 
                key={item.product._id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #f1f1f1'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
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
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      {item.product.name}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #f1f1f1', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping:</span>
              <span>
                {shipping === 0 ? (
                  <span style={{ color: '#28a745' }}>FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontWeight: 'bold',
              fontSize: '18px',
              borderTop: '1px solid #ddd',
              paddingTop: '12px',
              marginTop: '12px'
            }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {shipping === 0 && (
              <div style={{ 
                background: '#d4edda', 
                color: '#155724', 
                padding: '10px',
                borderRadius: '6px',
                marginTop: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                🎉 You qualify for free shipping!
              </div>
            )}

            {subtotal < 50 && shipping > 0 && (
              <div style={{ 
                background: '#fff3cd', 
                color: '#856404', 
                padding: '10px',
                borderRadius: '6px',
                marginTop: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </div>
            )}
          </div>
        </OrderSummary>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;