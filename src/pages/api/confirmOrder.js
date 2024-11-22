import connectToDatabase from '../../lib/mongoUtil'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { pnames, total, username } = req.body;  

  try {
    //getting data from orders collection
    const db = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    const order = {
      items: pnames,
      total,
      username,
      createdAt: new Date(),
    };

    //inserting each order made and using status codes to detect errors with orders
    const result = await ordersCollection.insertOne(order);
    if (result.acknowledged) {
      res.status(200).json({ success: true, message: 'Order confirmed', orderId: result.insertedId });
    } else {
      res.status(400).json({ success: false, message: 'Order submission failed' });
    }
  } catch (error) {
    console.error('Error in confirmOrder API:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
