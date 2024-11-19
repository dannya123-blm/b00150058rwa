// src/pages/api/register.js
import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields: username, email, and password.' });
    }

    try {
        const db = await connectToDatabase();
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email.includes("manager") ? "manager" : "customer";

        const result = await db.collection('Users').insertOne({
            username,
            email,
            password: hashedPassword,
            role  // role is set based on the email check
        });

        if (result.acknowledged) {
            res.status(200).json({ success: true, message: 'User registered', role: role });
        } else {
            res.status(400).json({ success: false, message: 'Registration failed' });
        }
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
