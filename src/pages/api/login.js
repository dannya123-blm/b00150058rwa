import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    // Check if the request method is POST, otherwise return a 405 Method Not Allowed response
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Extract username and password from the request body
    const { username, password } = req.body;

    // Validate that both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please enter both username and password.' });
    }

    try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();
        // Look for a user in the database with the given username
        const user = await db.collection('Users').findOne({ username });

        // If no user is found, return a 400 Invalid Credentials response
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Direct comparison of the plaintext password - not recommended for production!
        // Check if the password provided matches the one stored in the database
        if (password === user.password) {
            // Prepare user data to return on successful login
            const userData = {
                username: user.username,
                role: user.role
            };
            // Send a 200 OK response with the user data
            res.status(200).json({ success: true, message: 'Login successful', userData });
        } else {
            // If passwords do not match, return a 400 Invalid Credentials response
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        // Log any server errors and return a 500 Internal Server Error response
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
