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
  // State to track visibility of different sections
  const [showLogin, setShowLogin] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showReg, setShowReg] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);

  // Handlers to control what section to show
  const runShowLogin = () => {
    setShowFirstPage(false);
    setShowLogin(true);
    setShowDash(false);
  };

  const runShowDash = () => {
    setShowFirstPage(false);
    setShowLogin(false);
    setShowDash(true);
  };

  const runShowFirst = () => {
    setShowFirstPage(true);
    setShowLogin(false);
    setShowDash(false);
  };

  const runShowReg = () => {
    setShowDash(false);
    setShowLogin(false);
    setShowFirstPage(false);
    setShowReg(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button color="inherit" onClick={runShowFirst}>Main</Button>
          <Button color="inherit" onClick={runShowLogin}>Login</Button>
          <Button color="inherit" onClick={runShowDash}>Dashboard</Button>
          <Button color="inherit" onClick={runShowReg}>Register</Button>
        </Toolbar>
      </AppBar>

      {/* First Page Content */}
      {showFirstPage && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This is a very basic application. It has a bar across the top and this box! It works by toggling visibility of content based on user clicks, changing the state from hidden (false) to visible (true).
        </Box>
      )}

      {/* Login Section */}
      {showLogin && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This box is hidden until you click the login button! Imagine this is the login page of your app.
        </Box>
      )}

      {/* Dashboard Section */}
      {showDash && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          Let's pretend this is the dashboard!
        </Box>
      )}

       {/* Register Section */}
       {showReg && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          
        </Box>
      )}
    </Box>
  );
}
