import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const db = await connectToDatabase();
    const shoppingCartCollection = db.collection('shopping_cart');

    // Fetch the most recent cart
    const cart = await shoppingCartCollection.findOne({}, { sort: { _id: -1 } });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'No cart found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in getCart API:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
