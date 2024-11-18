// src/pages/api/register.js
import connectToDatabase from '../../lib/mongoUtil';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const db = await connectToDatabase();
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            // Automatically assign role based on email
            const role = email.includes("manager") ? "manager" : "customer";

            const result = await db.collection('Users').insertOne({
                username,
                email,
                password: hashedPassword,
                role  // role is set based on the email check
            });

            if (result.acknowledged) {
                res.status(201).json({ success: true, message: 'User registered', role: role });
            } else {
                res.status(400).json({ success: false, message: 'Registration failed' });
            }
        } catch (error) {
            console.error('Error in registration:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
