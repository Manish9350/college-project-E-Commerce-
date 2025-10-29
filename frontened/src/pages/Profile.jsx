import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
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

const AddressSection = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e1e5e9;
`;

const AddressCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: ${props => props.isDefault ? '2px solid #667eea' : '1px solid #e1e5e9'};
`;

const Profile = () => {
  const { user, dispatch } = useApp();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
      fetchUserProfile();
    }
  }, [user, setValue]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put('/api/users/profile', data);
      dispatch({ type: 'SET_USER', payload: response.data });
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await axios.put(`/api/users/address/${addressId}/default`);
      fetchUserProfile();
      toast.success('Default address updated!');
    } catch (error) {
      toast.error('Error updating default address');
    }
  };

  return (
    <ProfileContainer>
      <h1>My Profile</h1>
      
      <ProfileCard>
        <h2>Personal Information</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Full Name</label>
            <Input
              type="text"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
          </div>

          <div>
            <label>Email</label>
            <Input
              type="email"
              {...register('email', { required: 'Email is required' })}
              disabled
            />
          </div>

          <div>
            <label>Phone</label>
            <Input
              type="tel"
              {...register('phone')}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form>

        <AddressSection>
          <h3>My Addresses</h3>
          {addresses.length === 0 ? (
            <p>No addresses saved yet.</p>
          ) : (
            addresses.map(address => (
              <AddressCard key={address._id} isDefault={address.isDefault}>
                <h4>{address.name}</h4>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                {!address.isDefault && (
                  <Button 
                    onClick={() => handleSetDefaultAddress(address._id)}
                    style={{ marginTop: '10px', padding: '8px 16px', fontSize: '14px' }}
                  >
                    Set as Default
                  </Button>
                )}
                {address.isDefault && (
                  <span style={{ color: '#667eea', fontWeight: 'bold' }}>Default Address</span>
                )}
              </AddressCard>
            ))
          )}
        </AddressSection>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;