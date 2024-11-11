// mongoUtil.js
import { MongoClient } from 'mongodb';

const MongoDBURI = process.env.MongoDBURI; // Ensure this is correctly configured in your .env.local file
const client = new MongoClient(MongoDBURI);

let dbConnection;

async function connectToDatabase() {
    if (!dbConnection) {
        try {
            await client.connect();
            dbConnection = client.db('KirspyDB'); // Make sure 'DVSDB' is the correct database name
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    return dbConnection;
}

export default connectToDatabase;
