import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import styled from "styled-components";
import axios from "axios";
import { useApp } from "../context/AppContext";
import sampleProducts from "../config/sampleProducts";
import { staggerItems } from "../utils/animations";

// ... (styled components remain the same)

const Products = () => {
  const { products, dispatch, addToCart } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const productsRef = useRef();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading && !error && Array.isArray(products)) {
      staggerItems(productsRef.current);
    }
  }, [loading, error, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/products");

      let productsData = [];

      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else {
        productsData = response.data ? [response.data] : [];
      }

      // If API returned no products, fall back to frontend sample products
      if (!productsData || productsData.length === 0) {
        productsData = sampleProducts;
      }

      dispatch({ type: "SET_PRODUCTS", payload: productsData });
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        "Failed to load products from server — showing sample products."
      );
      // Fallback to local sample products on error
      dispatch({ type: "SET_PRODUCTS", payload: sampleProducts });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/products/categories/all");
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    gsap.to(e.target, {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  };

  // Safe products array
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <ProductsContainer>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div>Loading products...</div>
        </div>
      </ProductsContainer>
    );
  }

  if (error) {
    return (
      <ProductsContainer>
        <ErrorMessage>
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </ErrorMessage>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <h1>Our Products</h1>

      <FiltersSection>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div>
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FilterSelect>
        </div>
      </FiltersSection>

      <ProductsGrid ref={productsRef}>
        {filteredProducts.map((product) => (
          <ProductCard key={product._id}>
            <ProductImage
              src={
                product.images && product.images[0]
                  ? product.images[0]
                  : "/placeholder.jpg"
              }
              alt={product.name}
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTViOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
              }}
            />
            <h3>{product.name || "Unnamed Product"}</h3>
            <p style={{ color: "#666", marginBottom: "10px" }}>
              {product.description?.substring(0, 100)}...
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#667eea",
                }}
              >
                ${product.price || 0}
              </span>
              {product.originalPrice && (
                <span style={{ textDecoration: "line-through", color: "#999" }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <AddToCartButton
              onClick={(e) => handleAddToCart(product, e)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductsGrid>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </ProductsContainer>
  );
};

export default Products;
