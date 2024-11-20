'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/getOrders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          alert('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Orders fetch error:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box
      sx={{
        padding: 4,
        background: 'linear-gradient(135deg, #43cea2, #185a9d)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold' }}>
        Your Orders
      </Typography>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              padding: 2,
              marginBottom: 2,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography>Order ID: {order._id}</Typography>
            <Typography>Total: €{order.total}</Typography>
            <Typography>Items: {order.items.join(', ')}</Typography>
          </Paper>
        ))
      ) : (
        <Typography sx={{ textAlign: 'center', marginTop: 5 }}>No orders found.</Typography>
      )}
    </Box>
  );
}
