"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";


import '../css/register.css';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      setMessage(data.message || "Registration successful");
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      const data = await response.json();
      setMessage(data.message || "Registration failed");
    }
  };

  return (
    <Box className="register-page">
      <AppBar position="static" className="register-appbar">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Register
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xs" className="register-container">
  
        <Box component="form" onSubmit={handleSubmit} className="register-form">
          <TextField
            fullWidth
            variant="outlined"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            className="register-textfield"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            className="register-textfield"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            className="register-textfield"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            className="register-button"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          {message && (
            <Typography
              variant="body2"
              className={`register-message ${message.includes("successful") ? "register-message-success" : "register-message-error"}`}
            >
              {message}
            </Typography>
          )}
          <Typography variant="body2" className="register-link">
            Already have an account?{" "}
            <Link href="/login" underline="hover" color="#1b1f3">
              Login here
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
