'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu'; // Add this import for the menu icon

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful');
                // Redirect based on the role
                if (data.role === 'manager') {
                    router.push('/manager/managerDashboard');
                } else if (data.role === 'customer') {
                    router.push('/customer/customerDashboard');
                }
            } else {
                setMessage(data.message || 'Invalid username or password');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
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
                        Login
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
                    src="/images/krispyKreme.png"
                    alt="Kirspy"
                    width={260}
                    height={200}
                    priority
                    style={{
                        marginBottom: "2rem",
                        borderRadius: "10px",
                    }}
                />
                <Box
                    component="form"
                    onSubmit={handleLogin}
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
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ bgcolor: "white" }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ bgcolor: "white" }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            marginTop: 2,
                            bgcolor: "#6272e3",
                            color: "white",
                            ":hover": { bgcolor: "#556bd8" },
                        }}
                    >
                        Login
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
                    <Typography variant="body2" sx={{ marginTop: 2, color: "#f3f3f3" }}>
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
