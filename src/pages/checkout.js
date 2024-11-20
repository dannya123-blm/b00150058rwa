'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function Checkout() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/getCart');
        if (response.ok) {
          const data = await response.json();
          setCart(data);
        } else {
          alert('Failed to fetch cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  return (
    <Box
      sx={{
        padding: 4,
        background: 'linear-gradient(135deg, #43cea2, #185a9d)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}>
        Checkout
      </Typography>
      {cart ? (
        <Box>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Items in your cart:
          </Typography>
          {cart.pnames.map((item, index) => (
            <Typography key={index} sx={{ marginBottom: 1 }}>
              {item}
            </Typography>
          ))}
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Total: {cart.total}
          </Typography>
        </Box>
      ) : (
        <Typography sx={{ textAlign: 'center', marginTop: 5 }}>Loading cart details...</Typography>
      )}
    </Box>
  );
}
