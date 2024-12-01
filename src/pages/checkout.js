import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import '../css/checkout.css';

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const response = await fetch('/api/getCart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        alert('Failed to fetch cart');
      }
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    router.push('/customer/customerDashboard');
  };

  const confirmOrder = async () => {
    if (!cart) {
      alert('Your cart is empty!');
      return;
    }

    const response = await fetch('/api/confirmOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cart),
    });

    if (response.ok) {
      setOpenDialog(true);
    } else {
      const error = await response.json();
      alert(`Failed to confirm order: ${error.message}`);
    }
  };

  return (
    <Box className="checkout-container">
      <Typography variant="h4" className="checkout-title">
        Checkout
      </Typography>
      {loading ? (
        <Typography className="loading-text">Loading cart details...</Typography>
      ) : cart ? (
        <Box>
          <Typography variant="h6" className="cart-items-title">
            Items in your cart:
          </Typography>
          {cart.pnames.map((item, index) => (
            <Paper key={index} className="cart-item">
              <Typography>{item}</Typography>
            </Paper>
          ))}
          <Typography variant="h6" className="cart-total">
            Total: {cart.total}
          </Typography>
          <Button variant="contained" color="primary" className="confirm-order-btn" onClick={confirmOrder}>
            Confirm Order
          </Button>
        </Box>
      ) : (
        <Typography className="empty-cart-text">Your cart is empty.</Typography>
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="success-dialog-title">
        <DialogTitle id="success-dialog-title">{"Order Made Successfully!"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
