'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function DashboardPage() {
  const [showDash, setShowDash] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [data, setData] = React.useState([]);
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    if (showDash) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/getProducts');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const result = await response.json();
          if (Array.isArray(result) && result.length > 0) {
            setData(result);
          } else {
            setData([]);
            setMessage('No products available.');
          }
        } catch (error) {
          setMessage('An error occurred while fetching data.');
          console.error('Fetch error:', error);
        }
      };
      fetchData();
    }
  }, [showDash]);

  const runShowDash = () => {
    setShowDash(true);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const checkout = () => {
    console.log('Cart:', cart);
    alert('Checkout complete! Cart contents have been logged.');
    setCart([]); // Clears the cart after checkout
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
        minHeight: '100vh',
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: '#1b1f3a',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="../images/KirspyKreme.png" 
            alt="Kirspy Kreme Logo"
            sx={{ width: '100px', height: 'auto', margin: 'auto' }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kirspy Kremes
          </Typography>
          <Button color="inherit" onClick={runShowDash}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>



      
      {showDash && (
        <Box
          component="section"
          sx={{
            p: 4,
            border: '1px dashed #fff',
            margin: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Product List
          </Typography>
          <Typography variant="body1">{message}</Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {data && data.length > 0 ? (
              data.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    width: '30%',
                    maxWidth: '300px',
                    padding: '20px',
                    border: '1px solid white',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={item.imageUrl || '/images/placeholder.png'} 
                    alt={item.pname}
                    style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                  />
                    <Typography>{item.pname}</Typography>
                  <Typography>{item.price}</Typography>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => addToCart(item)}
                  >
                    Add to cart
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No products available.</Typography>
            )}
          </Box>

          {cart.length > 0 && (
            <Box
              sx={{
                marginTop: '20px',
                padding: '10px',
                border: '1px solid white',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Shopping Cart
              </Typography>
              {cart.map((item, i) => (
                <Typography key={i}>
                  {item.pname} - {item.price}
                </Typography>
              ))}
              <Button
                variant="contained"
                color="secondary"
                onClick={checkout}
                sx={{ marginTop: '10px' }}
              >
                Checkout
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
