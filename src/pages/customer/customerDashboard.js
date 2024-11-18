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

  const putInCart = (pname) => {
    console.log("Putting in cart:", pname);

    fetch(`/api/putInCart?pname=${encodeURIComponent(pname)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add product to cart");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // Optional: Log success message
        alert(`Added ${pname} to your cart!`);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart. Please try again.");
      });
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
                    onClick={() => putInCart(item.pname)}
                  >
                    Add to cart
                  </Button>
                </Box>
              ))
            ) : (
              <Typography>No products available.</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
