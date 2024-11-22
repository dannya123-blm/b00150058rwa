import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { cartItems, username } = req.body; 

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty or invalid format' });
    }

    try {
        const db = await connectToDatabase();
        const shoppingCartCollection = db.collection('shopping_cart');

        const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const productNames = cartItems.map(item => item.pname);

        const cartDocument = {
            pnames: productNames,
            total: `${totalPrice} euro`,
            username: username  
        };

        const result = await shoppingCartCollection.insertOne(cartDocument);

        res.status(200).json({ success: true, message: 'Cart submitted successfully!', cartId: result.insertedId });
    } catch (error) {
        console.error('Error in putInCart API:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
