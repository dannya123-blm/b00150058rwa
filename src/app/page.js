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

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password, // We are no longer passing the role here
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage(data.message || "Registration successful");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        background: "linear-gradient(135deg, #6a11cb, #2575fc)", // Same gradient as the main page
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "#1b1f3a", // Darker color for the AppBar
          boxShadow: "none",
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
            Register
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 3,
        }}
      >
        <Image
          src="/Images/kirspy.png"
          alt="Kirspy"
          width={260}
          height={200}
          priority
          style={{ marginBottom: "2rem" }}
        />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "none",
            background: "#1b1f3a", 
            padding: 4,
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            sx={{ bgcolor: "white" }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            sx={{ bgcolor: "white" }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            sx={{ bgcolor: "white" }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              marginTop: 2,
              bgcolor: "#6272e3",
              color: "white",
              ":hover": { bgcolor: "#556bd8" },
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          {message && (
            <Typography
              variant="body2"
              sx={{
                marginTop: 2,
                color: message.includes("successful") ? "green" : "red",
              }}
            >
              {message}
            </Typography>
          )}
          <Typography
            variant="body2"
            sx={{ marginTop: 2, color: "#f3f3f3" }}
          >
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
