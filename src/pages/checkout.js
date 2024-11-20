'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const confirmOrder = async () => {
    if (!cart) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch('/api/confirmOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });

      if (response.ok) {
        alert('Order confirmed! Your order has been processed successfully.');
        router.push('/customer/customerDashboard'); // Redirect to customer dashboard
      } else {
        const error = await response.json();
        alert(`Failed to confirm order: ${error.message}`);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('An error occurred. Please try again.');
    }
  };

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
      {loading ? (
        <Typography sx={{ textAlign: 'center', marginTop: 5 }}>Loading cart details...</Typography>
      ) : cart ? (
        <Box>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Items in your cart:
          </Typography>
          {cart.pnames.map((item, index) => (
            <Paper
              key={index}
              sx={{
                padding: 2,
                marginBottom: 1,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography>{item}</Typography>
            </Paper>
          ))}
          <Typography variant="h6" sx={{ marginTop: 3 }}>
            Total: {cart.total}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginTop: 3,
              width: '100%',
              padding: 1.5,
              fontSize: '1rem',
            }}
            onClick={confirmOrder}
          >
            Confirm Order
          </Button>
        </Box>
      ) : (
        <Typography sx={{ textAlign: 'center', marginTop: 5 }}>Your cart is empty!</Typography>
      )}
    </Box>
  );
}
