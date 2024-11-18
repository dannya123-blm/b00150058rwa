import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    try {
        console.log("In the putInCart API page");

        // Extract product name from query params
        const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
        const pname = searchParams.get('pname');

        if (!pname) {
            return res.status(400).json({ success: false, message: 'Product name is required' });
        }

        console.log("Putting in cart:", pname);

        const db = await connectToDatabase();
        const collection = db.collection('shopping_cart');

        // Replace "sample@test.com" with dynamic user authentication logic if available
        const userEmail = "sample@test.com"; // Placeholder for now

        // Insert the product into the shopping cart
        const insertResult = await collection.insertOne({ pname, username: userEmail });

        console.log("Inserted into cart:", insertResult);

        res.status(200).json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Error in putInCart API:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
