import React, { useEffect, useState } from 'react';
import { AppBar, Box, CircularProgress, IconButton, Paper, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import '../../css/manager.css';

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
        <Box className="manager-container">
            <AppBar position="static" className="manager-appbar">
                <Toolbar className="manager-toolbar">
                    <Typography variant="h6" className="manager-title">
                        Manager Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={logout}
                        className="manager-logout-button"
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {loading ? (
                <CircularProgress />
            ) : (
                <Box>
                    <Typography variant="h6" className="manager-order-stats-title">Order Stats:</Typography>
                    <Typography>Total Orders: {orders.length}</Typography>
                    <Typography>Total Cost: €{orders.reduce((acc, order) => acc + parseFloat(order.total), 0).toFixed(2)}</Typography>

                    <Typography variant="h6" className="manager-order-list-title">List of Orders:</Typography>
                    {orders.map(order => (
                        <Paper key={order._id} className="manager-order-item">
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
