import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { pageEnter, staggerItems } from '../utils/animations';
import API_BASE_URL from '../config/api';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 40px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #667eea;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: #e74c3c;
  background: #fdf2f2;
  border-radius: 10px;
  margin: 20px 0;
`;

const Home = () => {
  const { products, dispatch, addToCart } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageRef = useRef();
  const productsRef = useRef();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && !error && Array.isArray(products)) {
      pageEnter(pageRef.current);
      staggerItems(productsRef.current);
    }
  }, [loading, error, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/products`);
      
      // Handle different response structures
      let productsData = [];
      
      if (Array.isArray(response.data)) {
        // If response.data is directly an array
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        // If response.data has a products property that's an array
        productsData = response.data.products;
      } else {
        // If it's a single product or unexpected format
        productsData = response.data ? [response.data] : [];
      }
      
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    gsap.to(e.target, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
  };

  // Safe products array
  const safeProducts = Array.isArray(products) ? products : [];

  if (loading) {
    return (
      <HomeContainer>
        <LoadingSpinner>
          <div>🔄 Loading products...</div>
        </LoadingSpinner>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ErrorMessage>
          <h3>❌ Error Loading Products</h3>
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Again
          </button>
        </ErrorMessage>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer ref={pageRef}>
      <HeroSection>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to Our Store</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Discover amazing products at great prices
        </p>
      </HeroSection>

      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Featured Products</h2>
      
      {safeProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No products available</h3>
          <p>Check back later for new products!</p>
        </div>
      ) : (
        <ProductsGrid ref={productsRef}>
          {safeProducts.map(product => (
            <ProductCard key={product._id || product.id}>
              <ProductImage 
                src={product.images && product.images[0] ? product.images[0] : '/placeholder.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTViOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <h3 style={{ marginBottom: '10px' }}>{product.name || 'Unnamed Product'}</h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '15px',
                fontSize: '14px',
                minHeight: '40px'
              }}>
                {product.description ? 
                  (product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description)
                  : 'No description available'
                }
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                  ${product.price || 0}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <AddToCartButton 
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}
    </HomeContainer>
  );
};

export default Home;