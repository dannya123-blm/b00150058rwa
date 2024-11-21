// src/pages/api/confirmOrder.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { items, total, username } = req.body; // Get username from request

  try {
      const db = await connectToDatabase();
      const ordersCollection = db.collection('orders');

      const order = {
          items: items,
          total: total,
          createdAt: new Date(),
          username: username  // Use provided username
      };

      const result = await ordersCollection.insertOne(order);

      res.status(200).json({ success: true, orderId: result.insertedId });
  } catch (error) {
      console.error('Error in confirmOrder API:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
