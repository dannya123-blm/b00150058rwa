"use client";

import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('userData', JSON.stringify(data.userData));
            setMessage('Login successful');

            if (data.userData.role === 'manager') {
                router.push('/manager/managerDashboard');
            } else if (data.userData.role === 'customer') {
                router.push('/customer/customerDashboard');
            }
        } else {
            setMessage(data.message || 'Invalid username or password');
        }
    };

    return (
        <Box className="customer-dashboard" sx={{ background: 'linear-gradient(45deg, #2196F3, #21CBF3)', minHeight: '100vh' }}>
            <AppBar position="static" className="customer-appbar" sx={{ background: 'linear-gradient(45deg, #1A237E, #2196F3)' }}>
                <Toolbar className="customer-toolbar">
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Login
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xs" sx={{ mt: 3 }}>
                <Box component="form" onSubmit={handleLogin} sx={{ backgroundColor: '#fff', padding: 3, borderRadius: 2 }}>
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.slice(0, 30))}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.slice(0, 30))}
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, background: 'linear-gradient(45deg, #2196F3, #21CBF3)', color: '#fff' }}
                    >
                        Login
                    </Button>
                    {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
                </Box>
            </Container>
        </Box>
    );
}
