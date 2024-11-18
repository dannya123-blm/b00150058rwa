import connectToDatabase from '../../lib/mongoUtil';
import Product from '../../models/products'; // Ensure correct path

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ success: false, message: 'Unauthorized - You must be logged in.' });
    }

    const { pname } = req.query;
    const product = await Product.findOne({ pname });

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    try {
        const collection = db.collection('shopping_cart');
        await collection.insertOne({
            pname,
            username: session.user.name,
        });
        res.status(200).json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Error in putInCart API:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
