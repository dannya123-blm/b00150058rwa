import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await connectToDatabase();
    const orders = await db.collection('orders').find().toArray();

    // Calculate total statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    res.status(200).json({ totalOrders, totalRevenue, orders });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
