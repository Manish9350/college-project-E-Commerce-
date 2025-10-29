import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 10px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid ${props => props.error ? '#e74c3c' : '#e1e5e9'};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid ${props => props.error ? '#e74c3c' : '#e1e5e9'};
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
`;

const SubmitButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const CheckoutForm = ({ onOrderCreated, loading }) => {
  const { cart, user } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          name: data.fullName,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        paymentMethod: 'card' // Default to card payment
      };

      // Create order
      const response = await axios.post('/api/orders', orderData);
      
      toast.success('Order created successfully!');
      onOrderCreated(response.data);
      
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-fill form with user data if available
  const defaultValues = {
    fullName: user?.name || '',
    email: user?.email || '',
    // Add other fields as needed
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormSection>
        <SectionTitle>Shipping Information</SectionTitle>
        
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            placeholder="Full Name"
            defaultValue={defaultValues.fullName}
            {...register('fullName', { 
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            error={errors.fullName}
          />
          {errors.fullName && <ErrorMessage>{errors.fullName.message}</ErrorMessage>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input
            type="email"
            placeholder="Email Address"
            defaultValue={defaultValues.email}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            placeholder="Street Address"
            {...register('address', { 
              required: 'Street address is required',
              minLength: {
                value: 5,
                message: 'Please enter a valid address'
              }
            })}
            error={errors.address}
          />
          {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
        </div>

        <InputGrid>
          <div>
            <Input
              type="text"
              placeholder="City"
              {...register('city', { 
                required: 'City is required'
              })}
              error={errors.city}
            />
            {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
          </div>

          <div>
            <Select
              {...register('state', { 
                required: 'State is required'
              })}
              error={errors.state}
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </Select>
            {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
          </div>
        </InputGrid>

        <InputGrid>
          <div>
            <Input
              type="text"
              placeholder="ZIP Code"
              {...register('zipCode', { 
                required: 'ZIP code is required',
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Invalid ZIP code format'
                }
              })}
              error={errors.zipCode}
            />
            {errors.zipCode && <ErrorMessage>{errors.zipCode.message}</ErrorMessage>}
          </div>

          <div>
            <Select
              {...register('country', { 
                required: 'Country is required'
              })}
              error={errors.country}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
            </Select>
            {errors.country && <ErrorMessage>{errors.country.message}</ErrorMessage>}
          </div>
        </InputGrid>
      </FormSection>

      <FormSection>
        <SectionTitle>Shipping Method</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '2px solid #e1e5e9', borderRadius: '8px' }}>
            <input 
              type="radio" 
              value="standard" 
              {...register('shippingMethod', { required: 'Please select a shipping method' })} 
              defaultChecked
            />
            <div>
              <div style={{ fontWeight: '600' }}>Standard Shipping</div>
              <div style={{ color: '#666', fontSize: '14px' }}>5-7 business days - Free</div>
            </div>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '2px solid #e1e5e9', borderRadius: '8px' }}>
            <input 
              type="radio" 
              value="express" 
              {...register('shippingMethod')} 
            />
            <div>
              <div style={{ fontWeight: '600' }}>Express Shipping</div>
              <div style={{ color: '#666', fontSize: '14px' }}>2-3 business days - $9.99</div>
            </div>
          </label>
        </div>
        {errors.shippingMethod && <ErrorMessage>{errors.shippingMethod.message}</ErrorMessage>}
      </FormSection>

      <SubmitButton type="submit" disabled={isSubmitting || loading}>
        {isSubmitting ? 'Creating Order...' : 'Continue to Payment'}
      </SubmitButton>
    </Form>
  );
};

export default CheckoutForm;