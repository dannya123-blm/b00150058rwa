'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Paper, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';

export default function DashboardPage() {
  const [showDash, setShowDash] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (showDash) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/getProducts');
          if (!response.ok) throw new Error('Failed to fetch products');
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setMessage('');
          } else {
            setProducts([]);
            setMessage('No products available.');
          }
        } catch (error) {
          console.error('Fetch error:', error);
          setMessage('An error occurred while fetching data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [showDash]);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const submitCart = () => {
    if (cartItems.length > 0) {
      router.push({
        pathname: '/checkout',
        query: { cartItems: JSON.stringify(cartItems) },
      });
    } else {
      alert('Your cart is empty!');
    }
  };

  const runShowDash = () => setShowDash(true);

  return (
    <Box
      sx={{
        flexGrow: 1,
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <AppBar position="static" sx={{ background: '#1b1f3a', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Customer Dashboard
          </Typography>
          <Button color="inherit" onClick={runShowDash} sx={{ textTransform: 'none' }}>
            Show Products
          </Button>
        </Toolbar>
      </AppBar>

      {!showDash && (
        <Typography
          variant="h6"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Go Ahead! Press Show Products.
        </Typography>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress color="inherit" />
        </Box>
      )}

      {showDash && !loading && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}>
            Product List
          </Typography>
          {message && (
            <Typography sx={{ textAlign: 'center', marginBottom: 3, color: '#ffd700' }}>{message}</Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
            }}
          >
            {products.map((item, i) => (
              <Paper
                key={i}
                elevation={5}
                sx={{
                  width: '250px',
                  padding: 3,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                <img
                  src={item.imageUrl || '/images/placeholder.png'}
                  alt={item.pname}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {item.pname}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                  €{item.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(item)}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#6272e3',
                    ':hover': { backgroundColor: '#556bd8' },
                  }}
                >
                  Add to Cart
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {cartItems.length > 0 && (
        <Box sx={{ p: 4, marginTop: 4, background: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Your Cart
          </Typography>
          <Box sx={{ marginBottom: 2 }}>
            {cartItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 1,
                  padding: 2,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography>
                  {item.pname} - €{item.price}
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => removeFromCart(index)}
                  sx={{ textTransform: 'none' }}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={submitCart}
            sx={{
              width: '100%',
              padding: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: '#62d962',
              ':hover': { backgroundColor: '#56c856' },
            }}
          >
            Submit Cart
          </Button>
        </Box>
      )}
    </Box>
  );
}
