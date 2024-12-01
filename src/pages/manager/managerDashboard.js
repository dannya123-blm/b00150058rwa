import React, { useEffect, useState } from 'react';
import { AppBar, Box, CircularProgress, IconButton, Paper, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ManagerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetching orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const response = await fetch('/api/getOrders');
            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
            } else {
                console.error('Error fetching orders:', data.message);
            }
            setLoading(false);
        };

        fetchOrders();
    }, []);

    // Logout function
    const logout = () => {
        localStorage.removeItem('userData'); // Remove user session data
        router.push('/login'); // Redirect to login page
    };

    return (
        <Box sx={{
            flexGrow: 1,
            background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            minHeight: '100vh',
            color: '#fff',
            padding: 4
        }}>
            <AppBar position="static" sx={{ background: '#1b1f3a', boxShadow: 'none' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Manager Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={logout}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#e53935',
                            ':hover': { backgroundColor: '#c62828' },
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {loading ? (
                <CircularProgress />
            ) : (
                <Box>
                    <Typography variant="h6" sx={{ mt: 2 }}>Order Stats:</Typography>
                    <Typography>Total Orders: {orders.length}</Typography>
                    <Typography>Total Cost: €{orders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2)}</Typography>
                    
                    <Typography variant="h6" sx={{ mt: 4 }}>List of Orders:</Typography>
                    {orders.map(order => (
                        <Paper key={order._id} sx={{ p: 2, mt: 2, background: 'rgba(255, 255, 255, 0.2)' }}>
                            <Typography>Order ID: {order._id}</Typography>
                            <Typography>User: {order.username}</Typography>
                            <Typography>Time Placed: {new Date(order.createdAt).toLocaleString()}</Typography>
                            <Typography>Ordered Products: {order.items.join(', ')}</Typography>
                            <Typography>Total: €{order.total}</Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
}
