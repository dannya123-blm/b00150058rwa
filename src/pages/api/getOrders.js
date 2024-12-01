import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const db = await connectToDatabase();
  const orders = await db.collection('orders').find().toArray();

  // Calculate total statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

  res.status(200).json({ totalOrders, totalRevenue, orders });
}
