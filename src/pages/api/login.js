import bcrypt from 'bcrypt';
import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please enter both username and password.' });
    }

    try {
        const db = await connectToDatabase();
        const user = await db.collection('Users').findOne({ username });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare the hashed password using bcrypt
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const userData = {
                username: user.username,
                role: user.role
            };
            res.status(200).json({ success: true, message: 'Login successful', userData });
        } else {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
