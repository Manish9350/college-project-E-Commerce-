import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductDetailContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddToCartButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

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

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  const increaseQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Loading product...</div>
        </div>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Product not found</h2>
        </div>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <ProductDetailContent>
        <div>
          <ProductImage 
            src={product.images && product.images[selectedImage] ? product.images[selectedImage] : '/placeholder.jpg'} 
            alt={product.name}
          />
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #667eea' : '2px solid #e1e5e9'
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <ProductInfo>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
            ${product.price}
          </p>
          {product.originalPrice && (
            <p style={{ textDecoration: 'line-through', color: '#999' }}>
              Original: ${product.originalPrice}
            </p>
          )}
          
          <p style={{ lineHeight: '1.6' }}>{product.description}</p>
          
          <div>
            <h3>Specifications</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {product.features && product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <QuantityControl>
            <span>Quantity:</span>
            <QuantityButton 
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              -
            </QuantityButton>
            <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
              {quantity}
            </span>
            <QuantityButton 
              onClick={increaseQuantity}
              disabled={quantity >= (product.stock || 10)}
            >
              +
            </QuantityButton>
          </QuantityControl>

          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`}
          </AddToCartButton>

          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
            <p>🛒 Free shipping on orders over $50</p>
            <p>↩️ 30-day return policy</p>
            <p>🔒 Secure checkout</p>
          </div>
        </ProductInfo>
      </ProductDetailContent>
    </ProductDetailContainer>
  );
};

export default ProductDetail;