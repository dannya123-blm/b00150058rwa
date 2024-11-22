import connectToDatabase from '../../lib/mongoUtil';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields: username, email, and password.' });
    }

    try {
        //connectimng to the database and sents manager role if email has the word manager in it
        const db = await connectToDatabase();
        const role = email.includes("manager") ? "manager" : "customer";
        

        // results 
        const result = await db.collection('Users').insertOne({
            username,
            email,
            password, 
            role  
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
