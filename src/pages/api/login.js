// src/pages/api/login.js
import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    try {
        const db = await connectToDatabase();
        const user = await db.collection('Users').findOne({ username });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

                // In your login handler function after successful password verification:
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            res.status(200).json({ success: true, message: 'Login successful', role: user.role });
        } else {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
