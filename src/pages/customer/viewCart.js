import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Paper, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false); // State for controlling the Dialog visibility
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    router.push('/checkout'); // Navigate to checkout page after closing the dialog
  };

  const submitCart = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch('/api/putInCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems,
          username: userData.username // Pass username from local storage
        }),
      });

      if (response.ok) {
        setDialogOpen(true); // Open the success dialog
      } else {
        alert('Failed to submit cart.');
      }
    } catch (error) {
      console.error('Submit cart error:', error);
      alert('An error occurred. Please try again.');
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
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cart Submission Success"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Cart submitted successfully!!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Go to Checkout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
