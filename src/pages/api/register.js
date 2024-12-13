// Updated Register API
import bcrypt from 'bcrypt';
import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (username.length > 30) {
        return res.status(400).json({ success: false, message: 'Username cannot exceed 30 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectToDatabase();
    const role = email.includes("manager") ? "manager" : "customer";

    try {
        const result = await db.collection('Users').insertOne({
            username,
            email,
            password: hashedPassword,
            role,
        });

        res.status(200).json({ success: true, message: 'User registered successfully', role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
    }
}