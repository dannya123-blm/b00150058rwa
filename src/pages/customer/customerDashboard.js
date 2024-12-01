'use client';

import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, IconButton, Paper, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

// Import the customer CSS file
import '../../css/customer.css';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        'http://api.weatherapi.com/v1/current.json?key=a5bec305169942fe99f142501242110&q=Dublin&aqi=no'
      );
      const data = await response.json();
      setWeather(data.current);
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
      const response = await fetch('/api/getProducts');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
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
    <Box className="customer-dashboard">
      <AppBar position="static" className="customer-appbar">
        <Toolbar className="customer-toolbar">
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
              className="customer-cart-button"
            >
              View Cart
            </Button>
          </Badge>
          <Button
            variant="contained"
            color="error"
            onClick={logout}
            className="customer-logout-button"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {weather && (
        <Box className="customer-weather">
          <Typography variant="h6">Current Weather in Dublin</Typography>
          <Typography>{weather.condition.text}, {weather.temp_c}°C</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          Loading products...
        </Box>
      ) : (
        <Box className="customer-product-list">
          <Typography variant="h5" className="customer-product-list-title">
            Product List
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {products.map((item, i) => (
              <Paper key={i} elevation={5} className="customer-product-card">
                <img
                  src={item.imageUrl || '/images/placeholder.png'}
                  alt={item.pname}
                  className="customer-product-image"
                />
                <Typography variant="subtitle1" className="customer-product-name">
                  {item.pname}
                </Typography>
                <Typography variant="body1" className="customer-product-price">
                  €{item.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(item)}
                  className="customer-add-to-cart-button"
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
