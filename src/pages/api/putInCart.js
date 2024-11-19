import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    const { pname, username } = req.query; // Assuming username is passed as query parameter

    try {
        const db = await connectToDatabase();
        const product = await db.collection('products').findOne({ pname });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        await db.collection('shopping_cart').insertOne({
            pname: product.pname, 
            price: product.price, 
            username: username  // Use the passed username
        });

        res.status(200).json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Error in putInCart API:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
