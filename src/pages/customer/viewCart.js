'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const items = searchParams.get('cartItems');
    if (items) {
      setCartItems(JSON.parse(items).map((item) => ({ ...item, quantity: 1 }))); // Initialize quantity
    }
  }, [searchParams]);

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
    }
  };

  const userData = JSON.parse(localStorage.getItem('userData'));

const submitCart = async () => {
    try {
        const response = await fetch('/api/putInCart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartItems: cartItems,
                username: userData.username  // Pass username from local storage
            }),
        });

        // Handle response...
    } catch (error) {
        console.error('Submit cart error:', error);
    }
};


  return (
    <Box
      sx={{
        padding: 4,
        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}>
        Your Cart
      </Typography>
      {cartItems.length > 0 ? (
        <Box>
          {cartItems.map((item, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                padding: 2,
                marginBottom: 2,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography>
                {item.pname} - €{item.price} x {item.quantity}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                <Box>
                  <IconButton onClick={() => decreaseQuantity(index)}>
                    <Remove />
                  </IconButton>
                  <IconButton onClick={() => increaseQuantity(index)}>
                    <Add />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setCartItems(cartItems.filter((_, i) => i !== index))}
                  sx={{ marginLeft: 2 }}
                >
                  Remove
                </Button>
              </Box>
            </Paper>
          ))}
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginTop: 3,
              width: '100%',
              padding: 1.5,
              fontSize: '1rem',
            }}
            onClick={submitCart}
          >
            Submit Cart
          </Button>
        </Box>
      ) : (
        <Typography sx={{ textAlign: 'center', marginTop: 5 }}>Your cart is empty.</Typography>
      )}
    </Box>
  );
}
