'use client';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (router.query.cartItems) {
      try {
        setCartItems(JSON.parse(router.query.cartItems));
      } catch (error) {
        console.error('Error parsing cart items:', error);
      }
    }
  }, [router.query]);

  const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^0-9.-]+/g, '')), 0);

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      console.log('Cart items being sent:', cartItems); // Debugging log

      const response = await fetch('/api/confirmOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems }), // Send cart items
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order confirmed!');
        router.push('/customer/customerDashboard'); // Redirect to the dashboard
      } else {
        alert(`Failed to confirm order: ${data.message}`);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 3, background: 'linear-gradient(135deg, #6a11cb, #2575fc)', minHeight: '100vh', color: '#fff' }}>
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
        Checkout
      </Typography>
      {cartItems.length > 0 ? (
        <Box>
          {cartItems.map((item, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                marginBottom: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography sx={{ fontSize: '1.1rem' }}>
                {item.pname} - {item.price}
              </Typography>
              <Button
                color="error"
                variant="contained"
                onClick={() => removeFromCart(index)}
                sx={{ textTransform: 'none' }}
              >
                Remove
              </Button>
            </Paper>
          ))}
          <Typography variant="h6" sx={{ marginTop: 2, textAlign: 'right' }}>
            Total: €{totalPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 3, width: '100%', padding: 1.5, fontSize: '1rem' }}
            onClick={confirmOrder}
          >
            Confirm Order
          </Button>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 5 }}>
          Your cart is empty!
        </Typography>
      )}
    </Box>
  );
}
