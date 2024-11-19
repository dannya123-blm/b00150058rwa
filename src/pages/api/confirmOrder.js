import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { cartItems } = req.body;

  // Validate the cartItems array
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty or invalid format' });
  }

  // Extract only the product names
  const productNames = cartItems.map((item) => item.pname);

  try {
    const db = await connectToDatabase();

    // Calculate total price
    const total = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')); // Extract numeric price
      return acc + price;
    }, 0);

    // Save the order with only the product names
    const result = await db.collection('orders').insertOne({
      items: productNames, // Store only product names
      total,
      createdAt: new Date(),
    });

    if (result.insertedId) {
      res.status(200).json({ message: 'Order confirmed!', orderId: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to save order.' });
    }
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
