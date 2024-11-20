import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { pnames, total } = req.body;

  if (!pnames || !total || !Array.isArray(pnames)) {
    console.error('Invalid payload:', req.body);
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }

  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    // Create the order object
    const order = {
      items: pnames,
      total: parseFloat(total),
      createdAt: new Date(),
    };

    // Insert the order into the database
    const result = await ordersCollection.insertOne(order);

    console.log('Order saved:', order);

    res.status(200).json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error('Error in confirmOrder API:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
