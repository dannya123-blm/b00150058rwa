'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function MyApp() {
  const [showDash, setShowDash] = useState(false);

  const runShowDash = () => {
    setShowDash(true);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)', // Replace with exact gradient from your image
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
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kirspy Kremes
          </Typography>
          <Button color="inherit" onClick={runShowDash}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dashboard Section */}
      {showDash && (
        <Box
          component="section"
          sx={{
            p: 4,
            border: '1px dashed #fff',
            margin: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Let's pretend this is the dashboard!
        </Box>
      )}
    </Box>
  );
}
