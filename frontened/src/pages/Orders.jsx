import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'delivered': return '#28a745';
      case 'shipped': return '#17a2b8';
      case 'processing': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  background-color: ${props => {
    switch(props.status) {
      case 'delivered': return '#d4edda';
      case 'shipped': return '#d1ecf1';
      case 'processing': return '#fff3cd';
      case 'cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};

  color: ${props => {
    switch(props.status) {
      case 'delivered': return '#155724';
      case 'shipped': return '#0c5460';
      case 'processing': return '#856404';
      case 'cancelled': return '#721c24';
      default: return '#383d41';
    }
  }};
`;

const Orders = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      processing: '#ffc107',
      shipped: '#17a2b8',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return (
      <OrdersContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading orders...</div>
        </div>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here!</p>
        </div>
      ) : (
        orders.map(order => (
          <OrderCard key={order._id} status={order.orderStatus}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p style={{ color: '#666' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge status={order.orderStatus}>
                  {order.orderStatus}
                </StatusBadge>
                <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px' }}>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <h4>Items:</h4>
              {order.items && order.items.map((item, index) => (
                <OrderItem key={index}>
                  <img 
                    src={item.product?.images?.[0] || '/placeholder.jpg'} 
                    alt={item.product?.name}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover', 
                      borderRadius: '8px' 
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{item.product?.name}</div>
                    <div style={{ color: '#666' }}>Quantity: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </OrderItem>
              ))}
            </div>

            {order.shippingAddress && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4>Shipping Address:</h4>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </OrderCard>
        ))
      )}
    </OrdersContainer>
  );
};

export default Orders;