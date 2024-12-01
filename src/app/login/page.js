'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';

import '../../css/login.css';

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Added message state to show login status
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear any previous message

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userData', JSON.stringify(data.userData)); // Save user data to local storage
            setMessage('Login successful'); // Show success message

            if (data.userData.role === 'manager') {
                router.push('/manager/managerDashboard');
            } else if (data.userData.role === 'customer') {
                router.push('/customer/customerDashboard');
            }
        } else {
            setMessage(data.message || 'Invalid username or password'); // Show error message
        }
    };

    return (
        <Box className="login-page">
            <AppBar position="static" className="login-appbar">
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
                        Login
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xs" className="login-container">
                <Box component="form" onSubmit={handleLogin} className="login-form">
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-textfield"
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-textfield"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="login-button"
                    >
                        Login
                    </Button>
                    {message && (
                        <Typography
                            variant="body2"
                            className={`login-message ${message.includes("successful") ? "login-message-success" : "login-message-error"}`}
                        >
                            {message}
                        </Typography>
                    )}
                    <Typography variant="body2" className="login-link">
                        Don't have an account?{" "}
                        <Link href="/" underline="hover" color="#1b1f3">
                            Sign Up here
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
