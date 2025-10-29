import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const initialState = {
  user: null,
  cart: [],
  products: [],
  loading: false
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product._id === action.payload.product._id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product._id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };


  // In your AppContext.js, update the login logic
const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    dispatch({ type: 'SET_USER', payload: user });
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

  return (
    <AppContext.Provider value={{
      ...state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);