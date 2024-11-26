'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Paper, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'http://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no'
        );
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        setWeather(data.current);
      } catch (error) {
        console.error('Weather fetch error:', error);
      }
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        console.log("Logged in as:", userData.username);
    } else {
        router.push('/login');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('userData'); // Remove user session data
    router.push('/login'); // Redirect to login page
  };

  // Fetch products from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getProducts');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    alert(`${product.pname} has been added to the cart!`);
  };

  const viewCart = () => {
    router.push({
      pathname: '/customer/viewCart',
      query: { cartItems: JSON.stringify(cartItems) },
    });
  };

  return (
    <Box sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #6a11cb, #2575fc)', minHeight: '100vh', color: '#fff' }}>
      <AppBar position="static" sx={{ background: '#1b1f3a', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Customer Dashboard
          </Typography>
          <Badge badgeContent={cartItems.length} color="secondary">
            <Button
              variant="contained"
              color="secondary"
              onClick={viewCart}
              sx={{
                textTransform: 'none',
                backgroundColor: '#ff9800',
                ':hover': { backgroundColor: '#f57c00' },
              }}
            >
              View Cart
            </Button>
          </Badge>
          <Button
            variant="contained"
            color="error"
            onClick={logout}
            sx={{
              textTransform: 'none',
              backgroundColor: '#e53935',
              ':hover': { backgroundColor: '#c62828' },
              marginLeft: 2,
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {weather && (
        <Box sx={{ textAlign: 'center', padding: 2, background: 'rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6">Current Weather in Dublin</Typography>
          <Typography>{weather.condition.text}, {weather.temp_c}°C</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          Loading products...
        </Box>
      ) : (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}>
            Product List
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
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
    </Box>
  );
}
