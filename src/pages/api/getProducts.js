import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const products = await db.collection('products').find({}).toArray(); // Fetch all products
            if (!products || products.length === 0) {
                return res.status(404).json({ success: false, message: 'No products found.' });
            }
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ success: false, message: 'Server error.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed.' });
    }
}
