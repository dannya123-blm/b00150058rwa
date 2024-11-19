'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function DashboardPage() {
  const [showDash, setShowDash] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (showDash) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/getProducts');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          } else {
            setProducts([]);
            setMessage('No products available.');
          }
        } catch (error) {
          setMessage('An error occurred while fetching data.');
          console.error('Fetch error:', error);
        }
      };
      fetchData();
    }
  }, [showDash]);

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const submitCart = async () => {
    try {
      for (const item of cartItems) {
        const response = await fetch(`/api/putInCart?pname=${encodeURIComponent(item.pname)}`);
        if (!response.ok) {
          throw new Error("Failed to add product to cart");
        }
      }
      alert('All items added to cart successfully!');
      setCartItems([]); // Clear cart after submission
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const runShowDash = () => {
    setShowDash(true);
  };

  return (
    <Box sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #6a11cb, #2575fc)', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: '#1b1f3a', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Customer Dashboard</Typography>
          <Button color="inherit" onClick={runShowDash}>
            Show Products
          </Button>
        </Toolbar>
      </AppBar>

      {showDash && (
        <Box component="section" sx={{ p: 4, border: '1px dashed #fff', margin: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.2)', color: '#fff', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Product List</Typography>
          <Typography variant="body1">{message}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {products.map((item, i) => (
              <Box key={i} sx={{ width: '30%', maxWidth: '300px', padding: '20px', border: '1px solid white', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={item.imageUrl || '/images/placeholder.png'} alt={item.pname} style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
                <Typography>{item.pname}</Typography>
                <Typography>${item.price}</Typography>
                <Button variant="outlined" color="inherit" onClick={() => addToCart(item)}>
                  Add to cart
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {cartItems.length > 0 && (
        <Box sx={{ p: 4, mt: 2, border: '1px solid #fff', borderRadius: 2, background: 'rgba(255, 255, 255, 0.1)', color: '#fff', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Your Cart</Typography>
          {cartItems.map((item, index) => (
            <Box key={index} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>{item.pname} - ${item.price}</Typography>
              <Button color="error" onClick={() => removeFromCart(index)}>Remove</Button>
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={submitCart}>Submit Cart</Button>
        </Box>
      )}
    </Box>
  );
}
