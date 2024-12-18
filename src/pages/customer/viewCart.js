import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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

  // Calculate the total of the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Ensure item.price and item.quantity are valid numbers
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);

      if (!isNaN(price) && !isNaN(quantity)) {
        return total + price * quantity;
      }

      return total;
    }, 0).toFixed(2); // Format the total to two decimal places
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
                {item.pname} : €{item.price}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
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
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Total: €{calculateTotal()}
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
