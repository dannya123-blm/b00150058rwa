import connectToDatabase from '../../lib/mongoUtil'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { pnames, total, username } = req.body;

  // Getting data from orders collection
  const db = await connectToDatabase();
  const ordersCollection = db.collection('orders');

  const order = {
    items: pnames,
    total,
    username,
    createdAt: new Date(),
  };

  // Inserting the order and using status codes to handle potential issues
  const result = await ordersCollection.insertOne(order);

  if (result.acknowledged) {
    return res.status(200).json({ success: true, message: 'Order confirmed', orderId: result.insertedId });
  } else {
    return res.status(400).json({ success: false, message: 'Order submission failed' });
  }
}
