import bcrypt from 'bcrypt';
import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields: username, email, and password.' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectToDatabase();
    const role = email.includes("manager") ? "manager" : "customer";

    // Insert the user with the hashed password
    const result = await db.collection('Users').insertOne({
        username,
        email,
        password: hashedPassword,
        role  
    });

    if (result.acknowledged) {
        res.status(200).json({ success: true, message: 'User registered', role: role });
    } else {
        res.status(400).json({ success: false, message: 'Registration failed' });
    }
}
